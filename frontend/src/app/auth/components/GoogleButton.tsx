import { Button } from '@/components/ui/button';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface GoogleButtonProps {
    className?: string;
    children?: React.ReactNode;
    onError?: (error: string) => void;
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({
    className = '',
    children,
    onError
}) => {
    const handleGoogleLogin = () => {
        try {
            // Redirect to the backend's Google auth endpoint
            window.location.href = `${process.env.REST_API_SERVER}/auth/google`;
        } catch (error) {
            if (onError) {
                onError('Failed to initiate Google login');
            }
        }
    };

    return (
        <Button
            type="button"
            onClick={handleGoogleLogin}
            variant="outline"
            className={`flex items-center justify-center gap-2 w-full ${className}`}
        >
            <FontAwesomeIcon icon={faGoogle} className="h-4 w-4" />
            {children ?? <span>Sign in with Google</span>}        
        </Button>
    );
}; 