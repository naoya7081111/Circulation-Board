export type NewsSouce = {
    id: number;
    title: string;
    communityid: number;
    userid: number;
    postdate: Date;
    important: boolean;
    content: string;
    username: string;
    imagename: string | null;
    complete: boolean;
}