/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useCallback } from "react"
import { News } from "../../type/News";
import { NewsSouce } from "../../type/NewsSouce";
import { useNewsLists } from "../context/useNewsLists";

export const useNewsGet = () => {

    const { setNewsLists } = useNewsLists();

    const newsGet = useCallback(() => {
        axios.get('/api/news/view').then((res) => {
            if(res.data.success){
                const newsSouce = res.data.news;
                const newsInfo: Array<News> = newsSouce.map((news: NewsSouce) => (
                    {
                        newsId: news.id,
                        newsTitle: news.title,
                        communityId: news.communityid,
                        uesrId: news.userid,
                        postDate: news.postdate,
                        isImportant: news.important,
                        newsContent: news.content,
                        newsUserName: news.username,
                        newsUserImageName: news.imagename,
                        isComplete: news.complete
                    }
                ))
                setNewsLists(newsInfo);
                return;
            } 
        }).catch((error) => {
            console.log(error);
            return;
        });
    }, [])
    return {newsGet};
}