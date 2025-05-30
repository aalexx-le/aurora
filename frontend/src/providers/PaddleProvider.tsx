'use client';

import { initializePaddle, type Paddle } from '@paddle/paddle-js';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

interface PaddleContextType {
  paddle: Paddle | undefined;
  loading: boolean;
}

const PaddleContext = createContext<PaddleContextType | undefined>(undefined);

interface PaddleProviderProps {
  children: ReactNode;
}

// Define a custom event type to handle various Paddle events
type PaddleCustomEvent = {
  name: string;
  data?: any;
};

export const PaddleProvider = ({ children }: PaddleProviderProps) => {
  const [paddle, setPaddle] = useState<Paddle | undefined>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PADDLE_CLIENT_ID;
    const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as 'sandbox' | 'production' | undefined;

    if (!clientId) {
      console.error('Paddle Client ID is not configured.');
      setLoading(false);
      return;
    }
     if (!environment) {
      console.error('Paddle Environment is not configured.');
      setLoading(false);
      return;
    }

    initializePaddle({
      token: clientId, // Use Seller ID (token) for authentication
      environment: environment,
      eventCallback: (event) => {
        // Use our custom event type to handle all events
        const customEvent = event as PaddleCustomEvent;
        console.log('Paddle event:', customEvent);
        
        // Handle all events using the custom event type
        switch(customEvent.name) {
          case 'checkout.completed': 
            router.refresh();
            break;
          
          case 'checkout.closed':
            break;
            
          case 'checkout.error':
            break;
            
          case 'transaction.updated':
            if (customEvent.data?.status === 'completed') {
              console.log('Payment processed successfully');
              router.refresh();
            }
            break;
            
          case 'subscription.updated':
            console.log('Subscription updated successfully');
            router.refresh();
            break;
            
          case 'subscription.canceled':
            console.log('Subscription canceled');
            router.refresh();
            break;
            
          default:
            console.log(customEvent);
            console.log(`Unhandled Paddle event: ${customEvent.name}`);
        }
      },
      
    })
      .then((paddleInstance) => {
        if (paddleInstance) {
          setPaddle(paddleInstance);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [router]);

  return (
    <PaddleContext.Provider value={{ paddle, loading }}>
      {children}
    </PaddleContext.Provider>
  );
};

export const usePaddle = () => {
  const context = useContext(PaddleContext);
  if (context === undefined) {
    throw new Error('usePaddle must be used within a PaddleProvider');
  }
  return context;
}; 