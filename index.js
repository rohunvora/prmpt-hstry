const fs = require('fs');
const path = require('path');

class PromptHistory {
  constructor(filePath = '.prmpt-hstry.json') {
    this.filePath = filePath;
  }

  init(projectName = '', description = '') {
    if (fs.existsSync(this.filePath)) {
      throw new Error('History file already exists');
    }

    const history = {
      project: projectName,
      description: description,
      prompts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.save(history);
    return history;
  }

  load() {
    if (!fs.existsSync(this.filePath)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
  }

  save(history) {
    history.updatedAt = new Date().toISOString();
    fs.writeFileSync(this.filePath, JSON.stringify(history, null, 2));
  }

  addPrompt(prompt, response = '', tags = [], note = '') {
    const history = this.load() || this.init();
    
    const entry = {
      id: history.prompts.length + 1,
      prompt,
      response,
      tags: Array.isArray(tags) ? tags : [],
      note,
      timestamp: new Date().toISOString()
    };

    history.prompts.push(entry);
    this.save(history);
    return entry;
  }

  getPrompts() {
    const history = this.load();
    return history ? history.prompts : [];
  }

  getPrompt(id) {
    const history = this.load();
    return history ? history.prompts.find(p => p.id === id) : null;
  }

  exportToJson(outputPath) {
    const history = this.load();
    if (!history) {
      throw new Error('No history to export');
    }
    fs.writeFileSync(outputPath, JSON.stringify(history, null, 2));
    return outputPath;
  }

  exportToMarkdown(outputPath) {
    const history = this.load();
    if (!history) {
      throw new Error('No history to export');
    }

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
    
    fs.writeFileSync(outputPath, markdown);
    return outputPath;
  }

  clear() {
    if (fs.existsSync(this.filePath)) {
      fs.unlinkSync(this.filePath);
      return true;
    }
    return false;
  }
}

module.exports = PromptHistory;
