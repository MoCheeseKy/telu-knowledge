import ArticleCard from "@/components/_shared/ArticleCard";
import MyArticleList from "@/components/_shared/MyArticleList";

export default function LibrarysView() {
    return (
         <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-12 xl:gap-16 py-6">
                    <div className="flex-1 flex flex-col w-full max-w-[679px]">
                        <div className="flex flex-col gap-2 mb-[64px]">
                            <h1 className="font-sans text-[32px] font-bold text-[var(--primary-text)] leading-tight">
                                Koleksi Kamu!
                            </h1>
                            <p className="font-sans text-[16px] font-normal text-[var(--foreground)] leading-relaxed">
                                Semua koleksi favoritmu, tersimpan di satu tempat.
                            </p>
                        </div>
        
                        <div className="flex flex-col gap-10">
                            <ArticleCard
                                topic="Software Engineering"
                                publisher="Rifky Muhammad Prayudhi"
                                postDate="12 September 2026"
                                title="Apakah C4 akan menggantikan Diagram Conventional saat ini?"
                                description="You're going to see these in someone's toolkit next year and wonder why you didn't hear about them first. Here's your head start."
                                imageUrl="/images/persona-c4.jpg"
                                likesCount="16,2k"
                                commentsCount="16,2k"
                                repostsCount="16,2k"
                                isLiked={true}
                                isBookmarked={true}
                            />
        
                            <div className="w-full border-t border-[var(--dust)]/40" />
        
                            <ArticleCard
                                topic="Software Engineering"
                                publisher="Rifky Muhammad Prayudhi"
                                postDate="12 September 2026"
                                title="Apakah C4 akan menggantikan Diagram Conventional saat ini?"
                                description="You're going to see these in someone's toolkit next year and wonder why you didn't hear about them first. Here's your head start."
                                imageUrl="/images/persona-c4.jpg"
                                likesCount="16,2k"
                                commentsCount="16,2k"
                                repostsCount="16,2k"
                                isLiked={false}
                                isBookmarked={false}
                            />
        
                            <div className="w-full border-t border-[var(--dust)]/40" />
        
                            <ArticleCard
                                topic="Software Engineering"
                                publisher="Rifky Muhammad Prayudhi"
                                postDate="12 September 2026"
                                title="Apakah C4 akan menggantikan Diagram Conventional saat ini?"
                                description="You're going to see these in someone's toolkit next year and wonder why you didn't hear about them first. Here's your head start."
                                imageUrl="/images/persona-c4.jpg"
                                likesCount="16,2k"
                                commentsCount="16,2k"
                                repostsCount="16,2k"
                                isLiked={false}
                                isBookmarked={false}
                            />
        
                            <div className="w-full border-t border-[var(--dust)]/40" />
        
                            <ArticleCard
                                topic="Software Engineering"
                                publisher="Rifky Muhammad Prayudhi"
                                postDate="12 September 2026"
                                title="Apakah C4 akan menggantikan Diagram Conventional saat ini?"
                                description="You're going to see these in someone's toolkit next year and wonder why you didn't hear about them first. Here's your head start."
                                imageUrl="/images/persona-c4.jpg"
                                likesCount="16,2k"
                                commentsCount="16,2k"
                                repostsCount="16,2k"
                                isLiked={false}
                                isBookmarked={false}
                            />
                        </div>
                    </div>
        
                    <aside className="w-full lg:w-[320px] xl:w-[340px] shrink-0 lg:sticky lg:top-24 flex flex-col gap-[32px] pt-2">
                        <MyArticleList />
                    </aside>
                </div>
    );
}
