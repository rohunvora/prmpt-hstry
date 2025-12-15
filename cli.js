#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

const HISTORY_FILE = '.prmpt-hstry.json';

// Helper function to read history file
function readHistory() {
  if (!fs.existsSync(HISTORY_FILE)) {
    return {
      project: '',
      description: '',
      prompts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
}

// Helper function to write history file
function writeHistory(data) {
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2));
}

program
  .name('prmpt-hstry')
  .description('Track and share your AI prompt history')
  .version('1.0.0');

// Initialize a new prompt history
program
  .command('init')
  .description('Initialize a new prompt history for your project')
  .option('-n, --name <name>', 'Project name')
  .option('-d, --description <description>', 'Project description')
  .action((options) => {
    if (fs.existsSync(HISTORY_FILE)) {
      console.log('Prompt history already exists. Use "add" to add new prompts.');
      return;
    }
    
    const history = {
      project: options.name || '',
      description: options.description || '',
      prompts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    writeHistory(history);
    console.log('✓ Initialized prompt history');
    if (history.project) console.log(`  Project: ${history.project}`);
  });

// Add a prompt to the history
program
  .command('add')
  .description('Add a new prompt to the history')
  .option('-p, --prompt <text>', 'The prompt text')
  .option('-r, --response <text>', 'The response/output')
  .option('-t, --tags <tags>', 'Comma-separated tags')
  .option('-n, --note <note>', 'Additional notes')
  .action((options) => {
    const history = readHistory();
    
    if (!options.prompt) {
      console.error('Error: Prompt text is required. Use -p or --prompt');
      process.exit(1);
    }
    
    const entry = {
      id: history.prompts.length + 1,
      prompt: options.prompt,
      response: options.response || '',
      tags: options.tags ? options.tags.split(',').map(t => t.trim()) : [],
      note: options.note || '',
      timestamp: new Date().toISOString()
    };
    
    history.prompts.push(entry);
    writeHistory(history);
    
    console.log(`✓ Added prompt #${entry.id}`);
  });

// View the prompt history
program
  .command('view')
  .description('View the prompt history')
  .option('-i, --id <number>', 'View specific prompt by ID')
  .option('-f, --full', 'Show full details')
  .action((options) => {
    const history = readHistory();
    
    if (history.prompts.length === 0) {
      console.log('No prompts in history yet. Use "add" to add prompts.');
      return;
    }
    
    if (options.id) {
      const prompt = history.prompts.find(p => p.id === parseInt(options.id));
      if (!prompt) {
        console.log(`Prompt #${options.id} not found.`);
        return;
      }
      console.log('\n' + '='.repeat(60));
      console.log(`Prompt #${prompt.id} - ${new Date(prompt.timestamp).toLocaleString()}`);
      console.log('='.repeat(60));
      console.log('\nPrompt:');
      console.log(prompt.prompt);
      if (prompt.response) {
        console.log('\nResponse:');
        console.log(prompt.response);
      }
      if (prompt.tags.length > 0) {
        console.log('\nTags:', prompt.tags.join(', '));
      }
      if (prompt.note) {
        console.log('\nNote:', prompt.note);
      }
      console.log('\n');
    } else {
      if (history.project) {
        console.log(`\nProject: ${history.project}`);
      }
      if (history.description) {
        console.log(`Description: ${history.description}\n`);
      }
      console.log(`Total prompts: ${history.prompts.length}\n`);
      
      history.prompts.forEach(p => {
        console.log(`#${p.id} - ${new Date(p.timestamp).toLocaleString()}`);
        if (options.full) {
          console.log(`  Prompt: ${p.prompt.substring(0, 100)}${p.prompt.length > 100 ? '...' : ''}`);
          if (p.tags.length > 0) {
            console.log(`  Tags: ${p.tags.join(', ')}`);
          }
        }
        console.log();
      });
    }
  });

// Export the history
program
  .command('export')
  .description('Export the prompt history')
  .option('-o, --output <file>', 'Output file (default: prmpt-hstry-export.json)')
  .option('-m, --markdown', 'Export as Markdown instead of JSON')
  .action((options) => {
    const history = readHistory();
    const outputFile = options.output || (options.markdown ? 'prmpt-hstry-export.md' : 'prmpt-hstry-export.json');
    
    if (options.markdown) {
      let markdown = '# Prompt History\n\n';
      
      if (history.project) {
        markdown += `**Project:** ${history.project}\n\n`;
      }
      if (history.description) {
        markdown += `**Description:** ${history.description}\n\n`;
      }
      
      markdown += `**Created:** ${new Date(history.createdAt).toLocaleString()}\n`;
      markdown += `**Last Updated:** ${new Date(history.updatedAt).toLocaleString()}\n`;
      markdown += `**Total Prompts:** ${history.prompts.length}\n\n`;
      markdown += '---\n\n';
      
      history.prompts.forEach(p => {
        markdown += `## Prompt #${p.id}\n\n`;
        markdown += `**Date:** ${new Date(p.timestamp).toLocaleString()}\n\n`;
        
        if (p.tags.length > 0) {
          markdown += `**Tags:** ${p.tags.map(t => `\`${t}\``).join(', ')}\n\n`;
        }
        
        markdown += `### Prompt\n\n`;
        markdown += `${p.prompt}\n\n`;
        
        if (p.response) {
          markdown += `### Response\n\n`;
          markdown += `${p.response}\n\n`;
        }
        
        if (p.note) {
          markdown += `### Note\n\n`;
          markdown += `${p.note}\n\n`;
        }
        
        markdown += '---\n\n';
      });
      
      fs.writeFileSync(outputFile, markdown);
    } else {
      fs.writeFileSync(outputFile, JSON.stringify(history, null, 2));
    }
    
    console.log(`✓ Exported to ${outputFile}`);
  });

// Clear/reset history
program
  .command('clear')
  .description('Clear all prompts from history')
  .option('-f, --force', 'Skip confirmation')
  .action((options) => {
    if (!fs.existsSync(HISTORY_FILE)) {
      console.log('No history file found.');
      return;
    }
    
    if (!options.force) {
      console.log('This will delete all prompts. Use --force to confirm.');
      return;
    }
    
    fs.unlinkSync(HISTORY_FILE);
    console.log('✓ History cleared');
  });

program.parse();
