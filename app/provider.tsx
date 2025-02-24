// Import from external dependencies first, sorted alphabetically
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Provider as JotaiProvider } from 'jotai';
import { Toaster } from 'sonner';

// Import internal modules/components after external ones
import { ThemeProvider } from '@/hooks/theme';

export default function RootProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <JotaiProvider>
            <ThemeProvider attribute='class' defaultTheme='light' enableSystem>
                {children}
                <Toaster />
            </ThemeProvider>
            <Analytics />
            <SpeedInsights />
        </JotaiProvider>
    );
}