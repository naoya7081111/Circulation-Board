import { AttachmentIcon } from "@chakra-ui/icons";
import { Button, FormControl, FormLabel, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spacer, Stack, Text, Box, Textarea } from "@chakra-ui/react";
import { ChangeEvent, memo, useCallback, useEffect, useState, VFC } from "react";
import { useLoginCommunity } from "../../../hooks/context/useLoginCommunity";
import { useDate } from "../../../hooks/useDate";
import { useHostGet } from "../../../hooks/useHostGet";
import { useResizeFile } from "../../../hooks/useResizeFile";
import { useUpdateCommunity } from "../../../hooks/useUpdateCommunity";
import { useUpdateCommunityImage } from "../../../hooks/useUpdateCommunityImage";
import { SettingButton } from "../../atoms/button/SettingButton";
import { DateText } from "../../atoms/text/DateText";
import { AreaText } from "../../atoms/text/AreaText";
import { SiteText } from "../../atoms/text/SiteText";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export const CommunityInfoModal: VFC<Props> = memo((props) => {

    const { isOpen, onClose } = props;

    const { loginCommunity } = useLoginCommunity();
    const { updateCommunity } = useUpdateCommunity();
    const { updateCommunityImage } = useUpdateCommunityImage();
    const { dateKanji } = useDate();
    const { resizeFile } = useResizeFile();
    const { hostCheck } = useHostGet();

    const [name, setName] = useState('');
    const [sentence, setSentence] = useState('');
    const [area, setArea] = useState('');
    const [site, setSite] = useState('');
    const [imageName, setImageName] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageFileLook, setImageFileLook] = useState<string | null>(null);
    const [ isSetting, setIsSetting ] = useState(false);

    useEffect(() => {
        setImageName(loginCommunity?.communityImageName ?? null)
        setName(loginCommunity?.communityName ?? '')
        setSentence(loginCommunity?.communitySentence ?? '')
        setArea(loginCommunity?.communityArea ?? '')
        setSite(loginCommunity?.communitySite ?? '')
    }, [loginCommunity])

    const onClickSetting = () => {
        setIsSetting(true);
    }

    const onCloseSet = () => {
        setIsSetting(false);
        onClose();        
    }

    const onClickBack = () => {
        setIsSetting(false);
    }

    const onClickUp = useCallback(() => {
        updateCommunity({ name, sentence, area, site });
        if(imageFile){
            updateCommunityImage({ imageFile });
        }
        setIsSetting(false);
    }, [updateCommunity, updateCommunityImage, name, sentence, area, site, imageFile, setIsSetting])

    const onChangeImage = async (e: any) => {
        try {
          const file = e.target.files[0]
          const proccesingImage = await resizeFile({ file })
          setImageFileLook(proccesingImage);
          setImageFile(file)
        } catch (err) {
          console.error(err)
        }
      }

    const onChangeName = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value);
    const onChangeSentence = (e: ChangeEvent<HTMLTextAreaElement>) => setSentence(e.target.value);
    const onChangeArea = (e: ChangeEvent<HTMLInputElement>) => setArea(e.target.value);
    const onChangeSite = (e: ChangeEvent<HTMLInputElement>) => setSite(e.target.value);

    return (
        <Modal isOpen={isOpen} onClose={onCloseSet} autoFocus={false} size='sm' motionPreset="slideInBottom">
            <ModalOverlay />
                <ModalContent bg='orange.50' padding={4}???marginX={4}>
                    <ModalHeader color='gray.500'>????????????????????????</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={4} >
                            {isSetting === false ? (
                                <>
                                <HStack>
                                <Image borderRadius="full" boxSize="42px" src={imageName === null ? `${process.env.PUBLIC_URL}/img/freemeisoncommunity.png` : `https://object-storage.tyo2.conoha.io/v1/nc_819897bd08504d38bcce5fc9b4d08a6f/test/${imageName}`} />
                                <Spacer />
                                {hostCheck() && (
                                    <>
                                    <SettingButton onClick={onClickSetting} >??????</SettingButton>                                    
                                    </>
                                )}
                                </HStack>
                                <Box>
                                    <Text fontSize="md" fontWeight="bold" >
                                        {loginCommunity?.communityName}
                                    </Text>
                                    <Text fontSize='xs' color='gray.500'>
                                    {`??????????????????ID:${loginCommunity?.communityId}`}
                                    </Text>                                        
                                </Box>
                                {loginCommunity?.communitySentence !== null && (
                                    <>
                                    <Text fontSize="sm" whiteSpace='pre-wrap'>{loginCommunity?.communitySentence}</Text> 
                                    </>
                                )}
                                <Box>
                                    <DateText fontSize="xs" color='gray.500' boxSize='3'>{dateKanji({ date: loginCommunity?.communityCreatedDate ?? null })}</DateText>
                                    {loginCommunity?.communityArea !== null && (
                                        <>
                                        <AreaText fontSize="xs" color='gray.500' boxSize='3'>{loginCommunity?.communityArea}</AreaText>                                        
                                        </>
                                    )}
                                    {loginCommunity?.communitySite !== null && (
                                        <>
                                        <SiteText fontSize="xs" color='gray.500' boxSize='3'>{loginCommunity?.communitySite}</SiteText>                                        
                                        </>
                                    )}
                                </Box>
                                <Spacer />                                
                                </>
                            ) : (
                                <>
                                <HStack textAlign='center'>
                                    <Button bg='transparent' fontSize='xs' color='teal.400' p={0} justifyContent='left' _hover={{ opacity: 'none' }} onClick={onClickBack}>??????</Button>
                                    <Spacer />
                                    <Button bg='transparent' fontSize='xs' color='orange.400' p={0} _hover={{ opacity: 'none' }} onClick={onClickUp} >??????</Button>
                                    </HStack>
                                    <FormControl >
                                        <FormLabel w='100px' _hover={{ cursor: "pointer" }}>
                                            <HStack spacing={1} borderColor='orange.400'>
                                            <Text mr={2}>??????</Text>
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
                                        <FormLabel>?????????????????????</FormLabel>
                                        <Input value={name} onChange={onChangeName} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>???????????????????????????</FormLabel>
                                        <Textarea value={sentence} onChange={onChangeSentence} fontSize="xs" />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>??????</FormLabel>
                                        <Input value={area} onChange={onChangeArea} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Web?????????</FormLabel>
                                        <Input value={site} onChange={onChangeSite} />
                                    </FormControl>

                                </>
                            )}
                        </Stack>
                    </ModalBody>
                </ModalContent>
        </Modal>

    )
})