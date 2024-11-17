interface ContentSectionProps {
    title: string
    desc: string
    children: JSX.Element
}

export default function ContentSection({
                                           title,
                                           desc,
                                           children,
                                       }: ContentSectionProps) {
    return (
        <div className='flex flex-1 flex-col p-2 gap-2'>
            <div className='flex-none'>
                <h3 className='text-lg font-medium'>{title}</h3>
                <p className='text-sm text-muted-foreground'>{desc}</p>
            </div>
            <div className='faded-bottom flex-1 overflow-auto scroll-smooth md:pb-16'>
                <div className='lg:max-w-xl'>{children}</div>
            </div>
        </div>
    )
}