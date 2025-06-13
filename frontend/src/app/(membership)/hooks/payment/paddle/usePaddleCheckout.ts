import { usePaddle } from "@/providers/PaddleProvider";
import type {
    CheckoutLineItem,
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
                return;
            }
            if (loading) {
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
                return;
            }
            if (loading) {
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
        (items: CheckoutLineItem[]) => {
            if (!paddle) {
                return;
            }
            if (loading) {
                return;
            }
            opRef.current = "update";
            setOperationLoading(true);
            try {
                paddle.Checkout.updateItems(items);
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
