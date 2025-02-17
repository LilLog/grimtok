import React from 'react';

interface ArticleCardProps {
  title: string;
  summary: string;
  link: string;
  imageUrl?: string; // Optional prop
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title, summary, link, imageUrl }) => {
    return (
        <div className="relative w-screen h-screen">
            {/* Full-Screen Image */}
            {imageUrl && (
                <img 
                src={imageUrl} 
                alt={title} 
                className="absolute inset-0 w-full h-full object-cover"
                />
            )}

            {/* Text Overlay Positioned at the Bottom */}
            <div className="absolute bottom-10 left-0 w-full px-6 py-4 text-white bg-black bg-opacity-50 opacity-75 backdrop-blur-md">
                <h2 className="text-3xl font-bold">{title}</h2>
                <p className="mt-2 text-lg">{summary}</p>
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">
                  Read More
                </a>
            </div>
      </div>
    );
  };
  
  export default ArticleCard;