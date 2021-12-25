import { Box, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { News } from "../../../type/News";
import { ListNewsCard } from "../../molecules/listCard/ListNewsCard";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    newsLists: Array<News>;
};

export const NewsListModal: VFC<Props> = memo((props) => {

    const { isOpen, onClose, newsLists } = props;

    const onClickNews = () => {
        alert('hjj')
    }


    return (
        <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} motionPreset="slideInBottom">
            <ModalOverlay />
                <ModalContent bg='orange.50' w='1000px' marginX={4}>
                    <ModalHeader color='gray.500'>ニュース一覧</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    <Box minHeight="60px" >
                    {newsLists?.map((news) => (
                        <ListNewsCard key={news.newsId} value={news.newsId} isComplete={news.isComplete} onClickNews={onClickNews}>{news.newsTitle}</ListNewsCard>
                    ))}
                    </Box>
                    </ModalBody>
                </ModalContent>
        </Modal>
    )
})