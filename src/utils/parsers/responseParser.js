/**
 * Parse AI responses to extract special content blocks for different learning modalities
 */

/**
 * Extract Mermaid diagram code blocks from text
 */
export const extractMermaidDiagrams = (text) => {
    const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
    const diagrams = [];
    let match;

    while ((match = mermaidRegex.exec(text)) !== null) {
        diagrams.push({
            code: match[1].trim(),
            fullMatch: match[0],
            index: match.index
        });
    }

    return diagrams;
};

/**
 * Extract code blocks (non-mermaid) from text
 */
export const extractCodeBlocks = (text) => {
    const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks = [];
    let match;

    while ((match = codeRegex.exec(text)) !== null) {
        const language = match[1] || 'javascript';

        // Skip mermaid blocks
        if (language.toLowerCase() === 'mermaid') continue;

        blocks.push({
            language,
            code: match[2].trim(),
            fullMatch: match[0],
            index: match.index
        });
    }

    return blocks;
};

/**
 * Extract coding challenges from AI responses
 * Expected format:
 * ```challenge
 * {
 *   "title": "...",
 *   "description": "...",
 *   "starterCode": "...",
 *   "testCases": [...]
 * }
 * ```
 */
export const extractCodingChallenges = (text) => {
    const challengeRegex = /```challenge\n([\s\S]*?)```/g;
    const challenges = [];
    let match;

    while ((match = challengeRegex.exec(text)) !== null) {
        try {
            const challengeData = JSON.parse(match[1].trim());
            challenges.push({
                data: challengeData,
                fullMatch: match[0],
                index: match.index
            });
        } catch (error) {
            console.error('Failed to parse challenge:', error);
        }
    }

    return challenges;
};

/**
 * Parse response for visual learners
 * Returns structured content with diagrams and code visualizations
 */
export const parseVisualResponse = (text) => {
    const mermaidDiagrams = extractMermaidDiagrams(text);
    const codeBlocks = extractCodeBlocks(text);

    // Remove extracted content from text
    let cleanText = text;
    [...mermaidDiagrams, ...codeBlocks].forEach(item => {
        cleanText = cleanText.replace(item.fullMatch, `[[${item.code ? 'CODE' : 'DIAGRAM'}_PLACEHOLDER_${item.index}]]`);
    });

    return {
        text: cleanText,
        mermaidDiagrams,
        codeBlocks,
        hasVisualContent: mermaidDiagrams.length > 0 || codeBlocks.length > 0
    };
};

/**
 * Parse response for auditory learners
 * Cleans up formatting for better TTS output
 */
export const parseAuditoryResponse = (text) => {
    let cleanText = text;

    // Remove code blocks (they don't read well)
    cleanText = cleanText.replace(/```[\s\S]*?```/g, '[code example]');

    // Remove Markdown formatting
    cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, '$1'); // Bold
    cleanText = cleanText.replace(/\*(.*?)\*/g, '$1'); // Italic
    cleanText = cleanText.replace(/`(.*?)`/g, '$1'); // Inline code
    cleanText = cleanText.replace(/#{1,6}\s/g, ''); // Headers

    // Convert lists to spoken format
    cleanText = cleanText.replace(/^[-*]\s/gm, '• ');
    cleanText = cleanText.replace(/^\d+\.\s/gm, '');

    return {
        text: cleanText.trim(),
        originalText: text
    };
};

/**
 * Parse response for kinesthetic learners
 * Extracts interactive coding challenges
 */
export const parseKinestheticResponse = (text) => {
    const codeBlocks = extractCodeBlocks(text);
    const challenges = extractCodingChallenges(text);

    let cleanText = text;
    [...codeBlocks, ...challenges].forEach(item => {
        cleanText = cleanText.replace(item.fullMatch, `[[${item.data ? 'CHALLENGE' : 'CODE'}_PLACEHOLDER_${item.index}]]`);
    });

    return {
        text: cleanText,
        codeBlocks,
        challenges,
        hasInteractiveContent: codeBlocks.length > 0 || challenges.length > 0
    };
};

/**
 * Main parser that routes to appropriate modality parser
 */
export const parseResponse = (text, learningStyle) => {
    switch (learningStyle?.toLowerCase()) {
        case 'visual':
            return parseVisualResponse(text);
        case 'auditory':
            return parseAuditoryResponse(text);
        case 'kinesthetic':
            return parseKinestheticResponse(text);
        default:
            return { text, originalText: text };
    }
};
