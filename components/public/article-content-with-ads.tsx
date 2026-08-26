"use client"

import { BannerAd } from "./banner-ad"
import { ReactElement, useMemo } from "react"
import { sanitizeArticleContent } from "@/lib/html-sanitizer"

interface ArticleContentWithAdsProps {
  content: string
  banners: Array<{
    id: string
    title: string
    type: string
    imageUrl: string | null
    adCode: string | null
    linkUrl: string | null
    order: number
  }>
}

export function ArticleContentWithAds({ content, banners }: ArticleContentWithAdsProps) {
  // Sanitize content to prevent XSS
  const sanitizedContent = useMemo(() => sanitizeArticleContent(content), [content])
  
  // Split content by paragraphs
  const paragraphs = sanitizedContent.split('</p>')

  // Calculate positions for ads (distribute evenly)
  const totalParagraphs = paragraphs.length
  const adsToInsert = banners.filter(b => b.order >= 100 && b.order < 200) // order 100-199 for in-content ads

  if (adsToInsert.length === 0) {
    // No in-content ads, return original content
    return (
      <div
        className="article-content prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-800 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    )
  }

  // Sort ads by order
  const sortedAds = [...adsToInsert].sort((a, b) => a.order - b.order)

  // Calculate paragraph positions for each ad
  const adPositions = sortedAds.map((ad, index) => {
    // Distribute ads evenly throughout the content
    const position = Math.floor((totalParagraphs / (sortedAds.length + 1)) * (index + 1))
    return { ad, position }
  })

  // Build content with ads inserted
  const contentParts: ReactElement[] = []
  let currentParagraphIndex = 0

  adPositions.forEach(({ ad, position }, adIndex) => {
    // Add paragraphs before this ad
    const paragraphsBeforeAd = paragraphs.slice(currentParagraphIndex, position)
    if (paragraphsBeforeAd.length > 0) {
      contentParts.push(
        <div
          key={`content-${adIndex}`}
          className="article-content prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-800 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: paragraphsBeforeAd.join('</p>') + '</p>' }}
        />
      )
    }

    // Add the ad
    contentParts.push(
      <div key={`ad-${ad.id}`} className="my-8">
        <BannerAd banner={ad} variant="horizontal" />
      </div>
    )

    currentParagraphIndex = position
  })

  // Add remaining paragraphs after last ad
  const remainingParagraphs = paragraphs.slice(currentParagraphIndex)
  if (remainingParagraphs.length > 0) {
    contentParts.push(
      <div
        key="content-final"
        className="article-content prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-800 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: remainingParagraphs.join('</p>') }}
      />
    )
  }

  return <>{contentParts}</>
}
