import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import ArticleCard from './components/FeedCard';

interface Article {
  title: string;
  summary: string;
  link: string;
  imageUrl: string;
}

const App: React.FC = () => {
  const [article, setArticle] = useState<Article | null>(null);

  const fetchRandomArticle = async () => {
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
              grnlimit: "3",
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
        const summary = firstPage?.extract;
        const link = firstPage?.fullurl;
        

        setArticle({
          title: title,
          summary: summary || "No summary available.",
          link: link || "https://wh40k.lexicanum.com/wiki/Main_Page",
          imageUrl: imageUrl || "https://images.ctfassets.net/ps7sveckw0ws/5sFBsAZ8RT8k1khbOfdloT/78945ae16ba082d5ba4a5dd88ceaba6e/Quiz_Image.jpg",
        });
      } catch (error) {
        console.error("Error fetching Wikipedia article:", error);
      }
    }

  useEffect(() => {
      fetchRandomArticle();
    }, []);

  if (!article) return <p>Error...</p>;


  return (
    <div className="App">
      <button
        onClick={fetchRandomArticle}
        className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 z-50"
      >
        Load New Article
      </button>
      <ArticleCard
        title={article.title}
        summary={article.summary}
        link={article.link}
        imageUrl={article.imageUrl}
      />
    </div>
    
  );
};

export default App;
