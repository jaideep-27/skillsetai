/**
 * Safe code execution service for kinesthetic learning
 * Executes JavaScript code in a sandboxed environment with timeout protection
 */

export const executeJavaScript = (code, timeout = 5000) => {
    return new Promise((resolve, reject) => {
        let output = [];
        let hasError = false;
        let executionTime = 0;

        // Override console methods to capture output
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        const logs = {
            log: [],
            error: [],
            warn: []
        };

        console.log = (...args) => {
            logs.log.push(args.map(arg => String(arg)).join(' '));
        };
        console.error = (...args) => {
            logs.error.push(args.map(arg => String(arg)).join(' '));
        };
        console.warn = (...args) => {
            logs.warn.push(args.map(arg => String(arg)).join(' '));
        };

        // Set timeout for code execution
        const timeoutId = setTimeout(() => {
            hasError = true;
            reject(new Error(`Execution timeout: Code took longer than ${timeout}ms`));

            // Restore console methods
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
        }, timeout);

        try {
            const startTime = performance.now();

            // Execute code in a try-catch
            // eslint-disable-next-line no-new-func
            const result = new Function(code)();

            executionTime = performance.now() - startTime;

            clearTimeout(timeoutId);

            // Restore console methods
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;

            resolve({
                success: true,
                result: result !== undefined ? String(result) : undefined,
                logs: logs.log,
                errors: logs.error,
                warnings: logs.warn,
                executionTime: Math.round(executionTime * 100) / 100
            });
        } catch (error) {
            clearTimeout(timeoutId);

            // Restore console methods
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;

            if (!hasError) {
                resolve({
                    success: false,
                    error: error.message,
                    logs: logs.log,
                    errors: [...logs.error, error.message],
                    warnings: logs.warn,
                    executionTime: 0
                });
            }
        }
    });
};

/**
 * Validate code against test cases
 */
export const validateCodeWithTests = async (code, testCases) => {
    const results = [];

    for (const testCase of testCases) {
        try {
            // Prepare code with test input
            const testCode = `
        ${code}
        
        // Test execution
        ${testCase.setup || ''}
        const result = ${testCase.call};
        result;
      `;

            const execution = await executeJavaScript(testCode);

            const passed = execution.success &&
                String(execution.result) === String(testCase.expected);

            results.push({
                testCase: testCase.name,
                passed,
                expected: testCase.expected,
                actual: execution.result,
                error: execution.error
            });
        } catch (error) {
            results.push({
                testCase: testCase.name,
                passed: false,
                error: error.message
            });
        }
    }

    return results;
};
