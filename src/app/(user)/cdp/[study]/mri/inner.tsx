'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MriStatus } from '@prisma/client';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { FaCheck, FaCheckCircle, FaClock, FaPaperPlane, FaPen, FaQuestion } from 'react-icons/fa';

import {
    Box,
    BoxButtonPlus,
    BoxCollapseButton,
    BoxCollapser,
    BoxContent,
    BoxHeader,
    BoxTitle,
} from '@/components/boxes/boxes';
import { UpdateBox, UpdateBoxStatus } from '@/components/boxes/update-box';
import { LoadingFullStops } from '@/components/loading';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { reloadWindow } from '@/lib/utils';

import MRICreationForm from './form/form';
import { createNewMri, loadStudyMris, setMriStatus, storeMriData } from './form/mri';
import { MriFormType, MriServerData, equalMri, mriCreationSchema } from './form/schema';
import { RenderMRI } from './render';

interface InnerProps {
    studyCode: string;
    loadedMriData: MriServerData[];
}

// TODO: Make the most updated mris go to the start of the mri list (reverse what is done now)
// TODO: Auto collapse or expand box according to situations
// TODO: Delete MRI
// TODO: What happens it you delete the last MRI
// FIXME: Validation MRI

export default function Inner({ studyCode, loadedMriData }: InnerProps) {
    const [status, setStatus] = useState(UpdateBoxStatus.Ok);

    const [collapse, setCollapse] = useState(false);

    const [serverMriData, setServerMriData] = useState(loadedMriData);

    const [selectedMriId, setSelectedMriId] = useState(serverMriData[0].mriId);

    const selectedMri = useMemo(() => {
        return serverMriData.find((d) => d.mriId === selectedMriId);
    }, [serverMriData, selectedMriId]);

    if (!selectedMri) {
        throw Error(`Couldn't find Mri of id ${selectedMriId} in ${serverMriData}`);
    }

    // TODO: Remove logs
    console.log(`LoadedMriData: ${loadedMriData.map((o) => o.mriId)}`);
    console.log(`selectedMriId: ${selectedMriId}`);
    console.log(`selectedMri: ${selectedMri.mriId}`);

    const form: UseFormReturn<MriFormType> = useForm<MriFormType>({
        resolver: zodResolver(mriCreationSchema),
        defaultValues: selectedMri.data,
    });

    // this changes the form values when a new mri is selected
    useEffect(() => {
        if (selectedMri) {
            form.reset(selectedMri.data);
        }
    }, [selectedMri, form]);

    const mri = form.watch();

    const updateServer = () => {
        console.log('UPDATING SERVER');
        setStatus(UpdateBoxStatus.Loading);
        const formData = form.watch();
        storeMriData(selectedMriId, formData).then((updatedMriId) => {
            if (selectedMriId !== updatedMriId) {
                console.error(
                    `[updateServer]: Updated mri id "${updatedMriId}" doesn't correspond to selected mri id "${selectedMriId}`
                );
                setStatus(UpdateBoxStatus.Error);
            }
            loadStudyMris(studyCode).then((data) => {
                if (data) {
                    const loadedData = data.find((value) => value.mriId === updatedMriId);
                    setStatus(
                        loadedData && equalMri(loadedData?.data, formData)
                            ? UpdateBoxStatus.Ok
                            : UpdateBoxStatus.NotSynced
                    );
                    setServerMriData(data);
                }
            });
        });
    };

    const setNotSaved = () => {
        setStatus(UpdateBoxStatus.UserPending);
    };

    return (
        <div className="flex flex-col space-y-main w-full">
            <Box className="w-full">
                <BoxHeader>
                    <BoxTitle>Choix du MRI</BoxTitle>
                    <BoxCollapseButton
                        collapse={collapse}
                        setCollapse={setCollapse}
                    ></BoxCollapseButton>
                </BoxHeader>
                <BoxCollapser collapse={collapse}>
                    <BoxContent>
                        <MriSelector
                            studyCode={studyCode}
                            selectedId={selectedMriId}
                            setSelectedId={setSelectedMriId}
                            serverMriData={serverMriData}
                            setServerMriData={setServerMriData}
                        />
                    </BoxContent>
                </BoxCollapser>
            </Box>
            <div className="flex space-x-main h-full">
                <UpdateBox
                    status={status}
                    update={updateServer}
                    title="Écriture du MRI"
                    editable={selectedMri.status === MriStatus.InProgress}
                >
                    <MriEditorContent
                        setNotSaved={setNotSaved}
                        form={form}
                        updateServer={updateServer}
                        serverMriId={selectedMriId}
                        status={selectedMri.status}
                        study={studyCode}
                    />
                </UpdateBox>
                <Box className="w-full">
                    <BoxHeader>
                        <BoxTitle>Prévisualisation du MRI</BoxTitle>
                    </BoxHeader>
                    <BoxContent height="limited" noPadding>
                        <RenderMRI mri={mri} study={studyCode} admins={selectedMri.admins || []} />
                    </BoxContent>
                </Box>
            </div>
        </div>
    );
}

interface MriSelectorProps {
    studyCode: string;
    selectedId: string | undefined;
    setSelectedId: Dispatch<SetStateAction<string>>;
    serverMriData: MriServerData[];
    setServerMriData: Dispatch<SetStateAction<MriServerData[]>>;
}

function MriSelector({
    studyCode,
    selectedId,
    setSelectedId,
    serverMriData,
    setServerMriData,
}: MriSelectorProps) {
    const [loading, setLoading] = useState(true);
    const [mris, setMris] = useState<MriServerData[] | undefined>();

    useEffect(() => {
        loadStudyMris(studyCode).then((data) => {
            setMris(data);
            setLoading(false);
        });
    }, [studyCode, serverMriData]);

    const getStatusAssets = (status: MriStatus) => {
        switch (status) {
            case 'InProgress':
                return { color: 'text-yellow-300', logo: <FaPen /> };
            case 'Finished':
                return { color: 'text-green-300', logo: <FaCheck /> };
            case 'Validated':
                return { color: 'text-darkgreen-300', logo: <FaCheckCircle /> };
            case 'Sent':
                return { color: 'text-blue-300', logo: <FaPaperPlane /> };
            case 'Expired':
                return { color: 'text-purple-300', logo: <FaClock /> };
            default:
                return { color: 'text-white-300', logo: <FaQuestion /> };
        }
    };

    if (loading) {
        return <LoadingFullStops />;
    } else {
        if (mris === undefined) {
            return <p>Error loading mris !</p>;
        } else {
            return (
                <div className="flex flex-col w-full items-center">
                    <ToggleGroup
                        type="single"
                        unselectable="off"
                        value="selectedId"
                        onValueChange={(newValue) => {
                            if (newValue) {
                                setSelectedId(newValue);
                            }
                        }}
                    >
                        {mris.map((mri, i) => (
                            <ToggleGroupItem
                                value={mri.mriId ?? 'new_mri'}
                                key={i}
                                className={getStatusAssets(mri.status).color}
                            >
                                <p>{mri.data.title ?? 'Untitled MRI'}</p>
                                {getStatusAssets(mri.status).logo}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                    <BoxButtonPlus
                        onClick={() => {
                            createNewMri(studyCode).then((newMriData) => {
                                if (newMriData) {
                                    console.log(
                                        `New MRI was successfully created for study ${studyCode}, id=${newMriData}`
                                    );
                                    setServerMriData([newMriData, ...serverMriData]);
                                    setSelectedId(newMriData.mriId);
                                } else {
                                    throw Error('Error while creating a new mri');
                                }
                            });
                        }}
                        bg-black
                    />{' '}
                    <p>Selected item {selectedId}</p> {/* TODO: Remove */}
                </div>
            );
        }
    }
}

interface MriEditorContentProps {
    form: UseFormReturn<MriFormType>;
    serverMriId: string;
    updateServer: () => void;
    status: MriStatus;
    study: string;
    setNotSaved: () => void;
}

function MriEditorContent({
    form,
    updateServer,
    setNotSaved,
    serverMriId,
    status,
    study,
}: MriEditorContentProps) {
    const [loading, setLoading] = useState(false);

    switch (status) {
        case MriStatus.Sent:
            return (
                <div className="flex flex-col items-center justify-center">
                    <p>Trop tard... Il est parti...</p>
                </div>
            );
        case MriStatus.Finished:
        case MriStatus.Validated:
            return (
                <div className="flex flex-col items-center justify-center">
                    {loading ? (
                        <LoadingFullStops />
                    ) : (
                        <>
                            <p className="p-10 text-center">
                                Ce MRI a été soumis pour validation. Vous devez annuler cette étape
                                pour éditer votre MRI.
                            </p>
                            <Button
                                onClick={() => {
                                    if (serverMriId) {
                                        setLoading(true);
                                        setMriStatus(serverMriId, MriStatus.InProgress).then(() =>
                                            reloadWindow()
                                        );
                                    }
                                }}
                            >
                                Invalider pour modifier
                            </Button>
                        </>
                    )}
                </div>
            );
        case MriStatus.InProgress:
            return (
                <div className="flex flex-col items-center ">
                    <MRICreationForm
                        setNotSaved={setNotSaved}
                        form={form}
                        updateServer={updateServer}
                    />
                    {loading ? (
                        <LoadingFullStops />
                    ) : (
                        <Button
                            onClick={() => {
                                setLoading(true);
                                storeMriData(serverMriId, form.watch()).then((updatedMriId) => {
                                    if (!updatedMriId) {
                                        setLoading(false);
                                        return;
                                    }
                                    loadStudyMris(study).then((data) => {
                                        if (!data) {
                                            setLoading(false);
                                            return;
                                        }
                                        const loadedData = data.find(
                                            (value) => value.mriId === updatedMriId
                                        );
                                        if (loadedData === undefined) {
                                            console.error(
                                                `[MriEditorContent] Couldn't find an MRI with the correct id "${updatedMriId}"`
                                            );
                                            setLoading(false);
                                            return;
                                        }
                                        if (!equalMri(loadedData.data, form.watch())) {
                                            console.error(
                                                "[MriEditorContent] Saved MRI value doesn't correspond with the form values"
                                            );
                                            setLoading(false);
                                            return;
                                        }
                                        setMriStatus(updatedMriId, MriStatus.Finished).then(() => {
                                            reloadWindow();
                                        });
                                    });
                                });
                            }}
                        >
                            Valider le MRI
                        </Button>
                    )}
                </div>
            );
    }
}
