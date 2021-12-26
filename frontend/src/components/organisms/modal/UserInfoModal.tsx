/* eslint-disable react-hooks/exhaustive-deps */
import { Button, FormControl, FormLabel, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Stack, Text, Box, Textarea } from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons"
import { ChangeEvent, memo, useCallback, useEffect, useState, VFC } from "react";
import { useLoginUser } from "../../../hooks/context/useLoginUser";
import { LogoutButton } from "../../atoms/button/LogoutButton";
import { SettingButton } from "../../atoms/button/SettingButton";
import { useUpdateUser } from "../../../hooks/auth/useUpdateUser";
import { useResizeFile } from "../../../hooks/useResizeFile";
import { useUpdateUserImage } from "../../../hooks/auth/useUpdateUserImage";
import { EmailText } from "../../atoms/text/EmailText";
import { AreaText } from "../../atoms/text/AreaText";
import { SiteText } from "../../atoms/text/SiteText";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onClickLogout: () => void;
};

export const UserInfoModal: VFC<Props> = memo((props) => {

    const { loginUser } = useLoginUser();
    const { updateUser } = useUpdateUser();
    const { updateUserImage } = useUpdateUserImage();
    const { resizeFile } = useResizeFile();

    const { isOpen, onClose, onClickLogout } = props;

    const [imageName, setImageName] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [sentence, setSentence] = useState('');
    const [area, setArea] = useState('');
    const [site, setSite] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageFileLook, setImageFileLook] = useState<string | null>(null);
    const [isSetting, setIsSetting] = useState(false);

    useEffect(() => {
        setImageName(loginUser?.userImageName ?? null)
        setName(loginUser?.userName ?? '')
        setEmail(loginUser?.userEmail ?? '')
        setSentence(loginUser?.userSentence ?? '')
        setArea(loginUser?.userArea ?? '')
        setSite(loginUser?.userSite ?? '')
    }, [loginUser])

    const onClickSetting = () => {
        setIsSetting(true);
    }

    const onCloseSet = () => {
        setIsSetting(false);
        onClose();        
    }

    const onClickUp = useCallback(() => {
        updateUser({ name, email, sentence, area, site });
        if(imageFile){
            updateUserImage({ imageFile });
        }
        setIsSetting(false);
    }, [name, email, sentence, area, site, imageFile, updateUser]);

   const onClickBack = () => {
       setIsSetting(false);
   }

    const onChangeImage = async (e: any) => {
        try {
            const file = e.target.files[0]
            const proccesingImage = await resizeFile({file: file})
            setImageFileLook(proccesingImage);
            setImageFile(file)  
        } catch (err) {
            console.error(err)
        }
    }
 
    const onChangeName = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value);
    const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const onChangeSentence = (e: ChangeEvent<HTMLTextAreaElement>) => setSentence(e.target.value);
    const onChangeArea = (e: ChangeEvent<HTMLInputElement>) => setArea(e.target.value);
    const onChangeSite = (e: ChangeEvent<HTMLInputElement>) => setSite(e.target.value);


    return (
        <Modal isOpen={isOpen} onClose={onCloseSet} autoFocus={false} size='sm' motionPreset="slideInBottom">
            <ModalOverlay />
                <ModalContent bg='orange.50' padding={4}　marginX={4}>
                    <ModalHeader color='gray.500'>ユーザー情報</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={4} >
                            {isSetting === false ? (
                                <>
                                <HStack>
                                <Image borderRadius="full" boxSize="42px" src={imageName === null ? `${process.env.PUBLIC_URL}/img/freemeison.jpeg` : `https://object-storage.tyo2.conoha.io/v1/nc_819897bd08504d38bcce5fc9b4d08a6f/test/${imageName}`} />
                                <Spacer />
                                <SettingButton onClick={onClickSetting} >変更</SettingButton>
                                </HStack>   
                                <Box>
                                    <Text fontSize="md" fontWeight="bold" >
                                        {loginUser?.userName}
                                    </Text>
                                    <EmailText fontSize="xs" color='gray.500' boxSize='3'>{loginUser?.userEmail}</EmailText>
                                </Box>
                                {loginUser?.userSentence !== null && (
                                    <>
                                    <Text fontSize="sm" whiteSpace='pre-wrap'>
                                        {loginUser?.userSentence}
                                    </Text>                                        
                                    </>
                                )} 
                                <Box>
                                    {loginUser?.userArea !== null && (
                                        <>
                                        <AreaText fontSize="xs" color='gray.500' boxSize='3' >{loginUser?.userArea}</AreaText>
                                        </>
                                    )}
                                    {loginUser?.userSite !== null && (
                                        <>
                                        <SiteText fontSize="xs" color='gray.500' boxSize='3' >{loginUser?.userSite}</SiteText>
                                        </>
                                    )}
                                </Box>
                                <Spacer />                                
                                </>
                            ) : (
                                <>
                                <HStack textAlign='center'>
                                <Button bg='transparent' fontSize='xs' color='teal.400' p={0} justifyContent='left' _hover={{ opacity: 'none' }} onClick={onClickBack}>戻る</Button>
                                <Spacer />
                                <Button bg='transparent' fontSize='xs' color='orange.400' p={0} _hover={{ opacity: 'none' }} onClick={onClickUp} >保存</Button>
                                </HStack>
                                <FormControl >
                                    <FormLabel w='100px' _hover={{ cursor: "pointer" }}>
                                        <HStack spacing={1} borderColor='orange.400'>
                                        <Text mr={2}>画像</Text>
                                        <AttachmentIcon color='orange.400' />
                                        </HStack>
                                    </FormLabel>
                                    <Input type='file' name='file' accept='image/*' display='none' onChange={onChangeImage} border='none' />
                                    {imageFileLook !== null && (
                                        <>
                                        <Image borderRadius="full" border='2px' boxSize="96px" src={imageFileLook === null ? undefined : imageFileLook} alt={name} />                                           
                                        </>
                                    )}
                                </FormControl>
                                <FormControl>
                                    <FormLabel>名前</FormLabel>
                                    <Input value={name} onChange={onChangeName} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>メールアドレス</FormLabel>
                                    <Input value={email} onChange={onChangeEmail} />
                                </FormControl>      
                                <FormControl>
                                    <FormLabel>紹介文</FormLabel>
                                    <Textarea value={sentence} onChange={onChangeSentence} fontSize="xs" />
                                </FormControl>      
                                <FormControl>
                                    <FormLabel>地域</FormLabel>
                                    <Input value={area} onChange={onChangeArea} />
                                </FormControl>      
                                <FormControl>
                                    <FormLabel>Webサイト</FormLabel>
                                    <Input value={site} onChange={onChangeSite} />
                                </FormControl>      

                                </>
                            )
                            }
                        </Stack>
                    </ModalBody>
                    {isSetting === false && (
                        <>
                        <ModalFooter>
                            <LogoutButton onClick={onClickLogout} >ログアウト</LogoutButton>
                        </ModalFooter>                        
                        </>
                    )}
                </ModalContent>
        </Modal>

    )
})