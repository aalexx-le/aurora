import { usePaddle } from "@/providers/PaddleProvider";
import type {
    CheckoutOpenOptions,
    CheckoutUpdateOptions,
} from "@paddle/paddle-js";
import { useCallback, useRef, useState } from "react";

export const usePaddleCheckout = () => {
    const { paddle, loading: paddleLoading } = usePaddle();
    const [operationLoading, setOperationLoading] = useState(false);
    // Track if either operation is running
    const loading = paddleLoading || operationLoading;
    const opRef = useRef<
        "open" | "update" | "cancel" | "pause" | "resume" | null
    >(null);

    const openCheckout = useCallback(
        (options: CheckoutOpenOptions) => {
            if (!paddle) {
                console.error("Paddle is not initialized yet.");
                return;
            }
            if (loading) {
                console.log("Paddle is still loading...");
                return;
            }
            opRef.current = "open";
            setOperationLoading(true);
            try {
                paddle.Checkout.open(options);
            } finally {
                setOperationLoading(false);
                opRef.current = null;
            }
        },
        [paddle, loading],
    );

    const updateCheckout = useCallback(
        (options: CheckoutUpdateOptions) => {
            if (!paddle) {
                console.error("Paddle is not initialized yet.");
                return;
            }
            if (loading) {
                console.log("Paddle is still loading...");
                return;
            }
            opRef.current = "update";
            setOperationLoading(true);
            try {
                paddle.Checkout.updateCheckout(options);
            } finally {
                setOperationLoading(false);
                opRef.current = null;
            }
        },
        [paddle, loading],
    );

    const updateSubscriptionItems = useCallback(
        (options: { items: Array<{ priceId: string; quantity: number }> }) => {
            if (!paddle) {
                console.error("Paddle is not initialized yet.");
                return;
            }
            if (loading) {
                console.log("Paddle is still loading...");
                return;
            }
            opRef.current = "update";
            setOperationLoading(true);
            try {
                paddle.Checkout.updateItems(options.items);
            } finally {
                setOperationLoading(false);
                opRef.current = null;
            }
        },
        [paddle, loading],
    );

    return {
        openCheckout,
        updateCheckout,
        updateSubscriptionItems,
        loading,
    };
};
