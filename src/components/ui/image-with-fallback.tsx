"use client"

import { useState, useEffect } from "react"
import Image, { ImageProps } from "next/image"

interface ImageWithFallbackProps extends ImageProps {
    fallbackSrc: string
}

export function ImageWithFallback({ src, fallbackSrc, alt, ...props }: ImageWithFallbackProps) {
    const [imgSrc, setImgSrc] = useState(src)

    useEffect(() => {
        setImgSrc(src)
    }, [src])

    return (
        <Image
            {...props}
            src={imgSrc || fallbackSrc}
            alt={alt}
            onError={() => {
                setImgSrc(fallbackSrc)
            }}
        />
    )
}
