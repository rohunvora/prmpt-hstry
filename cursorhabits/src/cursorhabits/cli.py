#!/usr/bin/env python3
"""
cursorhabits CLI - Main entry point.

Usage:
    cursorhabits              # Analyze and generate rules
    cursorhabits --days 30    # Last 30 days only
    cursorhabits apply        # Apply rules to Cursor settings
"""

import click
from pathlib import Path

from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.table import Table
from rich import box

from .extractor import extract_messages, get_cursor_db_path
from .filters import filter_noise
from .analyzer import analyze_patterns, find_repeated_phrases, cluster_similar_messages
from .synthesizer import synthesize_rules, synthesize_rules_basic
from .output import print_results, save_rules
from .apply import apply_rules

console = Console()


@click.group(invoke_without_command=True)
@click.option("--days", type=int, default=None, help="Only analyze messages from last N days")
@click.option("--output", "-o", default="suggested_rules.md", help="Output file for rules")
@click.option("--no-llm", is_flag=True, help="Skip LLM synthesis (faster, less polished)")
@click.option("--export", type=click.Path(), help="Export raw messages to JSON")
@click.pass_context
def main(ctx, days, output, no_llm, export):
    """
    Turn your Cursor chat history into personalized rules.
    
    Run without arguments to analyze all messages and generate rules.
    """
    # If a subcommand is invoked, don't run the default behavior
    if ctx.invoked_subcommand is not None:
        return
    
    # Store options for subcommands
    ctx.ensure_object(dict)
    ctx.obj["days"] = days
    ctx.obj["output"] = output
    ctx.obj["no_llm"] = no_llm
    
    # Main analysis flow
    run_analysis(days=days, output=output, use_llm=not no_llm, export_path=export)


def run_analysis(days: int = None, output: str = "suggested_rules.md", use_llm: bool = True, export_path: str = None):
    """Run the full analysis pipeline."""
    
    # Header
    console.print()
    console.print(Panel.fit(
        "[bold]cursorhabits[/bold]\n[dim]Your chat history writes your rules[/dim]",
        border_style="cyan",
        padding=(0, 2),
    ))
    console.print()
    
    # Step 1: Find database
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
        transient=True,
    ) as progress:
        task = progress.add_task("Finding Cursor database...", total=None)
        
        try:
            db_path = get_cursor_db_path()
        except (FileNotFoundError, RuntimeError) as e:
            console.print(f"[red]✗[/red] {e}")
            raise SystemExit(1)
        
        progress.update(task, description=f"Found database at {db_path.parent.name}/...")
    
    # Step 2: Extract messages
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
        transient=True,
    ) as progress:
        task = progress.add_task("Extracting messages...", total=None)
        messages = extract_messages(db_path, days=days)
        progress.update(task, description=f"Extracted {len(messages)} messages")
    
    if not messages:
        console.print("[red]✗[/red] No messages found in your Cursor history.")
        console.print("[dim]Make sure you have some chat history in Cursor.[/dim]")
        raise SystemExit(1)
    
    console.print(f"[green]✓[/green] Found [bold]{len(messages)}[/bold] messages", end="")
    if days:
        console.print(f" [dim](last {days} days)[/dim]")
    else:
        console.print()
    
    # Step 3: Export if requested
    if export_path:
        import json
        from datetime import datetime
        
        export_data = {
            "exported_at": datetime.now().isoformat(),
            "message_count": len(messages),
            "messages": messages
        }
        with open(export_path, "w", encoding="utf-8") as f:
            json.dump(export_data, f, indent=2, ensure_ascii=False)
        console.print(f"[green]✓[/green] Exported to [bold]{export_path}[/bold]")
    
    # Step 4: Filter noise
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
        transient=True,
    ) as progress:
        task = progress.add_task("Filtering noise...", total=None)
        filtered = filter_noise(messages)
        removed = len(messages) - len(filtered)
        progress.update(task, description=f"Filtered {removed} noisy messages")
    
    console.print(f"[green]✓[/green] Kept [bold]{len(filtered)}[/bold] meaningful messages [dim](filtered {removed} noise)[/dim]")
    
    if not filtered:
        console.print("[yellow]⚠[/yellow] All messages were filtered as noise. Try with --days to get recent messages.")
        raise SystemExit(1)
    
    # Step 5: Analyze patterns
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
        transient=True,
    ) as progress:
        task = progress.add_task("Analyzing patterns...", total=None)
        patterns = analyze_patterns(filtered)
        phrases = find_repeated_phrases(filtered)
        clusters = cluster_similar_messages(filtered)
    
    pattern_count = len(patterns)
    console.print(f"[green]✓[/green] Detected [bold]{pattern_count}[/bold] patterns")
    
    # Step 6: Synthesize rules
    console.print()
    
    if use_llm:
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
            transient=True,
        ) as progress:
            task = progress.add_task("Synthesizing rules with AI...", total=None)
            rules_content = synthesize_rules(patterns, phrases, clusters)
            
            if rules_content is None:
                # LLM failed, fall back to basic
                progress.update(task, description="AI unavailable, using basic synthesis...")
                rules_content = synthesize_rules_basic(patterns, phrases)
                use_llm = False
    else:
        rules_content = synthesize_rules_basic(patterns, phrases)
    
    # Step 7: Display results
    print_results(patterns, phrases, use_llm=use_llm)
    
    # Step 8: Save rules
    output_path = Path(output)
    save_rules(rules_content, output_path)
    
    console.print()
    console.print(f"[green]✓[/green] Rules saved to [bold]{output_path}[/bold]")
    console.print()
    
    # Next steps
    console.print(Panel(
        "[bold]Next steps:[/bold]\n\n"
        "1. Review the generated rules in [cyan]suggested_rules.md[/cyan]\n"
        "2. Copy into [cyan]Cursor Settings → Rules for AI[/cyan]\n"
        "   Or run: [cyan]cursorhabits apply[/cyan]",
        border_style="dim",
        title="[dim]What now?[/dim]",
        title_align="left",
    ))


@main.command()
@click.option("--global", "global_rules", is_flag=True, help="Apply to global Cursor settings")
@click.option("--project", is_flag=True, help="Apply to current project (.cursor/rules/)")
@click.option("--file", type=click.Path(exists=True), default="suggested_rules.md", help="Rules file to apply")
def apply(global_rules, project, file):
    """Apply generated rules to Cursor settings."""
    
    if not global_rules and not project:
        # Default to project
        project = True
    
    rules_path = Path(file)
    if not rules_path.exists():
        console.print(f"[red]✗[/red] Rules file not found: {file}")
        console.print("[dim]Run 'cursorhabits' first to generate rules.[/dim]")
        raise SystemExit(1)
    
    apply_rules(rules_path, global_rules=global_rules, project_rules=project)


if __name__ == "__main__":
    main()

