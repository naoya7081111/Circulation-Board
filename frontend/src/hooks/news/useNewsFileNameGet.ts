import axios from "axios";
import { useCallback, useState } from "react";
import { NewsFileName } from "../../type/NewsFileName";
import { NewsFileNameSouce } from "../../type/NewsFileNameSouce";

type Props = {
    newsId: number;
};

export const useNewsFileNameGet = () => {

    const [newsFileNames, setNewsFileNames] = useState<Array<NewsFileName>>([]);

    const newsFileNameGet = useCallback((props: Props) => {

        const { newsId } = props;
        const data = { id: newsId };

        axios.post('/api/news/file/view', data).then((res) => {
            const newsFileNamesSouce = res.data.newsFileNames;
            const newsFileNamesInfo: Array<NewsFileName> = newsFileNamesSouce.map((name: NewsFileNameSouce) => (
                {
                    newsFileName: name.filename
                }
            ));
            setNewsFileNames(newsFileNamesInfo);
        }).catch((error) => {
            console.log(error);
        })
    }, []);
    return { newsFileNameGet, newsFileNames };
}