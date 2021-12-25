import { Image, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spacer, Stack, Switch, Textarea, Text } from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
import { ChangeEvent, memo, useState, VFC } from "react";
import Iframe from 'react-iframe';
import { useNewsPost } from "../../../hooks/news/useNewsPost";
import { useHostGet } from "../../../hooks/useHostGet";
import { PostButton } from "../../atoms/button/PostButton";
import { useResizeFile } from "../../../hooks/useResizeFile";
import { TextButton } from "../../atoms/button/TextButton";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export const NewsPostModal: VFC<Props> = memo((props) => {

    const { isOpen, onClose } = props;

    const { newsPost, loading } = useNewsPost();
    const { hostCheck } = useHostGet();
    const { resizeFile } = useResizeFile();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isImportant, setIsImportant] = useState(false);
    const [newsFile, setNewsFile] = useState<File | null>(null)
    const [newsFileLook, setNewsFileLook] = useState<string | null>(null);
    const [newsPdfFileLook, setNewsPdfFileLook] = useState<any>(null);

    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
    const onChangeContent = (e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);
    const onChangeImportant = () => setIsImportant(!isImportant);

    const onClickReset = () => {
        setNewsFile(null);
        setNewsFileLook(null);
        setNewsPdfFileLook(null);
    }

    const onChangeNewsFile = async (e: any) => {
        onClickReset();
        try {
            const file = e.target.files[0];
            const extension = file.name.split('.').pop();
            if (extension === 'pdf'){
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = () => {
                    setNewsPdfFileLook(fileReader.result);
                }
            } else {
                const proccessFile = await resizeFile({ file: file });
                setNewsFileLook(proccessFile);
            }
            setNewsFile(file);
        } catch (err) {
            console.error(err)
        }
    };

    const onClickPost = () => {
        newsPost({title, content, isImportant, newsFile});
        onClose();
        setIsImportant(false)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} size='lg' motionPreset="slideInBottom">
            <ModalOverlay />
                <ModalContent bg='orange.50' marginX={4}>
                    <ModalHeader color='gray.500'>ニュース投稿</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    <Stack spacing={4}>
                        <FormControl>
                            <Input placeholder='タイトルを入力してください' onChange={onChangeTitle} mb={4}/>
                            <Textarea h='180px' size='md' placeholder="ニュースを記載してください" onChange={onChangeContent} />
                        </FormControl>
                        <FormControl>
                            <FormLabel w='100%' _hover={{ cursor: "pointer" }}>
                                <HStack>
                                    <AttachmentIcon color='orange.400'/>
                                    <Text color='gray.400' fontSize='sm'>画像またはPDFファイル</Text>
                                </HStack>
                            </FormLabel>
                            <Input type='file' name='file' accept='image/*, .pdf' display='none' border='none' onChange={onChangeNewsFile} />
                            {newsFileLook !== null && (
                                <>
                                    <Image w='100%' src={newsFileLook === null ? undefined : newsFileLook} alt={title} />
                                    <TextButton buttonName='消去' onClick={onClickReset}/>
                                </>
                            )}
                            {newsPdfFileLook !== null && (
                                <>
                                    <Iframe url={newsPdfFileLook} width='100%' />
                                    <TextButton buttonName='消去' onClick={onClickReset}/>
                                </>
                            )}
                        </FormControl>
                        <HStack spacing={2}>
                            {hostCheck() ? (
                            <>
                                <FormLabel htmlFor="email-alerts" mb="0" color='gray.500'>
                                重要なニュース?
                                </FormLabel>
                                <Switch id="email-alerts" onChange={onChangeImportant}/>
                            </>
                            ) : null}
                            <Spacer />
                            <PostButton onClick={onClickPost} disabled={title ==='' || content === ''} loading={loading} >POST</PostButton>
                        </HStack>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>

    )
})