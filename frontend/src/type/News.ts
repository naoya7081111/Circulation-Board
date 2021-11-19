export type News  = {
    newsId: number;
    newsTitle: string;
    communityId: number;
    uesrId: number;
    postDate: Date;
    isImportant: boolean;
    newsContent: string;
    newsUserName: string;
    newsUserImageName: string | null;
    isComplete: boolean;
    fileName: Array<string> | null;
}