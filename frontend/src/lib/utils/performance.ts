/**
 * Performance measurement utilities
 */

/**
 * Measure data fetch performance
 *
 * @param name - Name of the data fetch operation
 * @returns Object with start and end methods
 */
export function measureDataFetch(name: string) {
    let startTime: number | null = null;

    return {
        start: () => {
            startTime = performance.now();
        },

        end: (success: boolean) => {
            if (startTime === null) return;

            const duration = performance.now() - startTime;
            console.debug(
                `[Performance] ${name}: ${duration.toFixed(2)}ms (${success ? "success" : "error"})`,
            );

            startTime = null;
        },
    };
}

/**
 * Measure component render time
 *
 * @param componentName - Name of the component
 * @returns Cleanup function
 */
export function measureRenderTime(componentName: string) {
    const startTime = performance.now();

    return () => {
        const duration = performance.now() - startTime;
        console.debug(
            `[Performance] ${componentName} render: ${duration.toFixed(2)}ms`,
        );
    };
}
