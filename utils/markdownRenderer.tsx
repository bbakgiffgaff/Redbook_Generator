import React from 'react';
import { MARKDOWN_STYLES } from '../constants';

// Types for parsed nodes
type MarkdownNode =
    | { type: 'text'; content: string }
    | { type: 'bold'; content: string }
    | { type: 'list'; items: string[] };

/**
 * Basic Markdown Parser
 * Supports:
 * - **Bold**: **text**
 * - List: - item (must be at start of line)
 */
export const parseMarkdown = (text: string): MarkdownNode[] => {
    const nodes: MarkdownNode[] = [];
    const lines = text.split('\n');

    let currentListItems: string[] = [];

    const flushList = () => {
        if (currentListItems.length > 0) {
            nodes.push({ type: 'list', items: [...currentListItems] });
            currentListItems = [];
        }
    };

    lines.forEach((line) => {
        const trimmed = line.trim();

        // Check for List Item
        if (trimmed.startsWith('- ')) {
            currentListItems.push(trimmed.substring(2));
        } else {
            flushList();
            // If line is empty string, parse as empty text node (newline)
            // Parse inline bold
            const parts = line.split(/(\*\*.*?\*\*)/g);
            parts.forEach(part => {
                if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
                    nodes.push({ type: 'bold', content: part.slice(2, -2) });
                } else if (part) {
                    nodes.push({ type: 'text', content: part });
                }
            });
            // Add newline after line (except last)
            nodes.push({ type: 'text', content: '\n' });
        }
    });

    flushList();

    // Clean up trailing newline node if exist
    if (nodes.length > 0) {
        const lastNode = nodes[nodes.length - 1];
        if (lastNode.type === 'text' && lastNode.content === '\n') {
            nodes.pop();
        }
    }

    return nodes;
};

/**
 * Renders parsed nodes to React Elements
 * Strictly applies MARKDOWN_STYLES
 */
export const renderMarkdown = (text: string, fontSize?: number): React.ReactNode => {
    const nodes = parseMarkdown(text);

    return nodes.map((node, index) => {
        if (node.type === 'bold') {
            return (
                <span key={index} style={MARKDOWN_STYLES.bold}>
                    {node.content}
                </span>
            );
        }

        if (node.type === 'list') {
            return (
                <ul key={index} style={MARKDOWN_STYLES.list}>
                    {node.items.map((item, i) => (
                        <li key={i} style={MARKDOWN_STYLES.listItem}>
                            {/* Recursive parsing for inline bold in list items? 
                                For simplicity V1, simplistic text. Can enhance if needed.
                             */}
                            {item}
                        </li>
                    ))}
                </ul>
            );
        }

        return <span key={index}>{node.content}</span>;
    });
};
