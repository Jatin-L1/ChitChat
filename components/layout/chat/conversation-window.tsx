// import { FaUser } from 'react-icons/fa';
// import { LuClipboardCopy, LuLoader2 } from 'react-icons/lu';
// import { Message } from 'ai';
// import { useAtom } from 'jotai';
// import Image from 'next/image';
// import { useTranslations } from 'next-intl';
// import { toast } from 'sonner';

// import { renderMarkdownMessage } from '@/components/layout/message';
// import store from '@/hooks/store';

// export const ConversationWindow = ({
//     messages,
//     isLoading,
// }: Readonly<{
//     messages: Message[];
//     isLoading: boolean;
// }>) => {
//     const t = useTranslations();

//     const [currentUseModel] = useAtom(store.currentUseModelAtom);

//     const onCopy = (context: string) => {
//         navigator.clipboard.writeText(context);

//         toast.success(t('copied'), {
//             position: 'top-right',
//         });
//     };

//     return (
//         <div className='container mx-auto flex flex-col items-start justify-start gap-3 md:w-11/12 xl:w-10/12'>
//             {messages.map((m) => (
//                 <div key={m.id} className='rounded-lg bg-zinc-100/80 p-2 backdrop-blur-sm dark:bg-neutral-600/70'>
//                     <div className='flex items-center justify-between'>
//                         {m.role == 'user' ? (
//                             <FaUser size={30} className='rounded-md border border-neutral-200 p-1 dark:border-neutral-600' />
//                         ) : (
//                             <Image src={`/img/${currentUseModel.provider}.png`} alt='U' width='30' height='30' className='rounded-md border border-neutral-200 p-1 dark:border-neutral-600' />
//                         )}
//                         {!isLoading && (
//                             <div className='space-x-1 rounded-md p-1'>
//                                 <button
//                                     onClick={() => onCopy(m.content)}
//                                     className='inline-flex items-center space-x-1 rounded-md bg-neutral-200 px-2 py-1 transition duration-300 ease-in-out hover:bg-neutral-400/30 dark:bg-neutral-600 dark:text-neutral-200/90 dark:shadow-lg dark:hover:bg-neutral-700 dark:hover:shadow-xl'
//                                 >
//                                     <LuClipboardCopy size={10} />
//                                     <span className='text-xs'>{t('copy')}</span>
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                     {renderMarkdownMessage(m.content)}
//                 </div>
//             ))}
//             {isLoading && <LuLoader2 className='animate-spin self-start text-neutral-600/90' size={24} />}
//         </div>
//     );
// };




import { FaUser } from 'react-icons/fa';
import { LuClipboardCopy, LuDownload,LuLoader2 } from 'react-icons/lu';
import { Message } from 'ai';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { renderMarkdownMessage } from '@/components/layout/message';
import store from '@/hooks/store';

export const ConversationWindow = ({
    messages,
    isLoading,
}: Readonly<{
    messages: Message[];
    isLoading: boolean;
}>) => {
    const t = useTranslations();
    const [currentUseModel] = useAtom(store.currentUseModelAtom);

    const onCopy = (context: string) => {
        navigator.clipboard.writeText(context);
        toast.success(t('copied'), {
            position: 'top-right',
        });
    };

    const onDownload = () => {
        // Create chat content with timestamps
        const chatContent = messages
            .map((m) => {
                const timestamp = new Date().toLocaleString();
                const role = m.role === 'user' ? 'User' : currentUseModel.provider;
                return `[${timestamp}] ${role}:\n${m.content}\n\n`;
            })
            .join('');

        // Create blob and download link
        const blob = new Blob([chatContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-history-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success(t('downloaded'), {
            position: 'top-right',
        });
    };

    return (
        <div className="container mx-auto flex flex-col items-start justify-start gap-3 md:w-11/12 xl:w-10/12">
            {messages.length > 0 && (
                <div className="mb-2 flex w-full justify-end">
                    <button
                        onClick={onDownload}
                        className="inline-flex items-center space-x-1 rounded-md bg-neutral-200 px-3 py-2 transition duration-300 ease-in-out hover:bg-neutral-400/30 dark:bg-neutral-600 dark:text-neutral-200/90 dark:shadow-lg dark:hover:bg-neutral-700 dark:hover:shadow-xl"
                    >
                        <LuDownload size={16} />
                        <span className="text-sm">{t('download')}</span>
                    </button>
                </div>
            )}
            {messages.map((m) => (
                <div key={m.id} className="rounded-lg bg-zinc-100/80 p-2 backdrop-blur-sm dark:bg-neutral-600/70">
                    <div className="flex items-center justify-between">
                        {m.role == 'user' ? (
                            <FaUser size={30} className="rounded-md border border-neutral-200 p-1 dark:border-neutral-600" />
                        ) : (
                            <Image src={`/img/${currentUseModel.provider}.png`} alt="U" width="30" height="30" className="rounded-md border border-neutral-200 p-1 dark:border-neutral-600" />
                        )}
                        {!isLoading && (
                            <div className="space-x-1 rounded-md p-1">
                                <button
                                    onClick={() => onCopy(m.content)}
                                    className="inline-flex items-center space-x-1 rounded-md bg-neutral-200 px-2 py-1 transition duration-300 ease-in-out hover:bg-neutral-400/30 dark:bg-neutral-600 dark:text-neutral-200/90 dark:shadow-lg dark:hover:bg-neutral-700 dark:hover:shadow-xl"
                                >
                                    <LuClipboardCopy size={10} />
                                    <span className="text-xs">{t('copy')}</span>
                                </button>
                            </div>
                        )}
                    </div>
                    {renderMarkdownMessage(m.content)}
                </div>
            ))}
            {isLoading && <LuLoader2 className="animate-spin self-start text-neutral-600/90" size={24} />}
        </div>
    );
};