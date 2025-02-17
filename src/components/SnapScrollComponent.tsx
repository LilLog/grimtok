import React from 'react';
import { useEffect, useState } from 'react'
import ArticleCard from './FeedCard';


interface Article {
    title: string;
    summary: string;
    link: string;
    imageUrl: string;
  }

function trimString(input: string, maxLength: number): string {
  return input.length > maxLength ? input.slice(0, maxLength) + "..." : input;
}

const SnapScrollComponent: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  
  const fetchRandomArticle = async (): Promise<Article | null> => {
    try {
      const apiUrl = "https://wh40k.lexicanum.com/mediawiki/api.php?";

      // Step 1: Get a random article title
      
      const randomResponse = await fetch(
        apiUrl +
          new URLSearchParams({
            action: "query",
            format: "json",
            generator: "random",
            grnnamespace: "0",
            prop: "extracts|images|imageinfo|info",
            inprop: "url",
            grnlimit: "1",
            exintro: "1",
            exlimit: "max",
            exsentences: "5",
            explaintext: "1",
            piprop: "thumbnail",
            pithumbsize: "800",
            origin: "*",
          })
      )
      const randomData = await randomResponse.json();
      
      const firstPage = Object.values(randomData.query.pages)?.[0] as { title: string , images: any, extract: string, fullurl: any};
      const title = firstPage?.title;
      const images = firstPage?.images || [];
      var imageUrl = null;

      if (!title) throw new Error("No random article found");

      if (images.length === 0) {
        console.log("No images found in this article.");
      } else {

      
        const imageTitles = images.map((img: { title: string }) => img.title).join("|");
        const imageInfoParams = new URLSearchParams({
            action: "query",
            format: "json",
            titles: imageTitles,
            prop: "imageinfo",
            iiprop: "url",
            origin: "*", // CORS
        });

        const imageInfoResponse = await fetch(apiUrl + imageInfoParams.toString());
        const imageInfoData = await imageInfoResponse.json();
        const imagePage =  Object.values(imageInfoData.query.pages)?.[1] as {imageinfo: any};
        if (!imagePage) {
          console.log("No image information found.");
        } else {
          imageUrl = imagePage?.imageinfo[0].url;
        }
      }

      // Step 2: Fetch article summary and image
      const summary = trimString(firstPage?.extract, 500);
      const link = firstPage?.fullurl;
      
      return {
        title: title,
        summary: summary || "No summary available.",
        link: link || "https://wh40k.lexicanum.com/wiki/Main_Page",
        imageUrl: imageUrl || "https://images.ctfassets.net/ps7sveckw0ws/5sFBsAZ8RT8k1khbOfdloT/78945ae16ba082d5ba4a5dd88ceaba6e/Quiz_Image.jpg"
      }
    } catch (error) {
      console.error("Error fetching Wikipedia article:", error);
      return null;
    }
    }

    const fetchMoreArticles = async () => {
        const newArticles: Article[] = [];
        for (let i = 0; i < 5; i++) {
          const article = await fetchRandomArticle();
          if (article) newArticles.push(article);
        }
        setArticles((prevArticles) => [...prevArticles, ...newArticles]);
      };
    
      useEffect(() => {
        fetchMoreArticles();
      }, []);

    if (articles.length < 4) return <p>Loading...</p>;

  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll hide-scroll">
      {articles.map((article, index) => (
        <div
          key={index}
          className="snap-start h-screen flex flex-col justify-center items-center bg-gray-100"
        >
        <ArticleCard
            title={article.title}
            summary={article.summary}
            link={article.link}
            imageUrl={article.imageUrl}
            />
        </div>
      ))}
    </div>
  );
};

export default SnapScrollComponent;