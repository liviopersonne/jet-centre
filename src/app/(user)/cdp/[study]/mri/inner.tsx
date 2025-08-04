'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MriStatus } from '@prisma/client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

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
import { loadStudyMris, setMriStatus, storeMriData } from './form/mri';
import { MriFormType, MriServerData, equalMri, mriCreationSchema } from './form/schema';
import { RenderMRI } from './render';

interface InnerProps {
    study: string;
    serverMriData: MriServerData;
}

// TODO: Initialise with undefined mri id if none is found
// TODO: Load correct mri in the form inputs
// TODO: Load empty mri if mriId is undefined

export default function Inner({ study, serverMriData }: InnerProps) {
    const form: UseFormReturn<MriFormType> = useForm<MriFormType>({
        resolver: zodResolver(mriCreationSchema),
        defaultValues: serverMriData.data,
    });

    const mri = form.watch();

    const [status, setStatus] = useState(UpdateBoxStatus.Ok);

    const [collapse, setCollapse] = useState(false);

    const [selectedMriId, setSelectedMriId] = useState(serverMriData.mriId);

    const updateServer = () => {
        setStatus(UpdateBoxStatus.Loading);
        const formData = form.watch();
        storeMriData(selectedMriId, study, formData).then((updatedMriId) => {
            if (!updatedMriId) {
                setStatus(UpdateBoxStatus.Error);
            }
            if (!selectedMriId) {
                console.log(
                    `New MRI was successfully created for study ${study}, id=${updatedMriId}`
                );
                // TODO: Reload the mri selector
                setSelectedMriId(updatedMriId);
            }
            loadStudyMris(study).then((data) => {
                const loadedData = data?.find((value) => value.mriId === updatedMriId);
                setStatus(
                    loadedData && equalMri(loadedData?.data, formData)
                        ? UpdateBoxStatus.Ok
                        : UpdateBoxStatus.NotSynced
                );
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
                            studyCode={study}
                            selectedId={selectedMriId}
                            setSelectedId={setSelectedMriId}
                        />
                    </BoxContent>
                </BoxCollapser>
            </Box>
            <div className="flex space-x-main h-full">
                <UpdateBox
                    status={status}
                    update={updateServer}
                    title="Écriture du MRI"
                    editable={serverMriData.status === MriStatus.InProgress}
                >
                    <MriEditorContent
                        setNotSaved={setNotSaved}
                        form={form}
                        updateServer={updateServer}
                        serverMriId={serverMriData.mriId}
                        status={serverMriData.status}
                        study={study}
                        mriId={selectedMriId}
                    />
                </UpdateBox>
                <Box className="w-full">
                    <BoxHeader>
                        <BoxTitle>Prévisualisation du MRI</BoxTitle>
                    </BoxHeader>
                    <BoxContent height="limited" noPadding>
                        <RenderMRI mri={mri} study={study} admins={serverMriData.admins || []} />
                    </BoxContent>
                </Box>
            </div>
        </div>
    );
}

interface MriSelectorProps {
    studyCode: string;
    selectedId: string | undefined;
    setSelectedId: Dispatch<SetStateAction<string | undefined>>;
}

function MriSelector({ studyCode, selectedId, setSelectedId }: MriSelectorProps) {
    const [loading, setLoading] = useState(true);
    const [mris, setMris] = useState<MriServerData[] | undefined>();

    useEffect(() => {
        loadStudyMris(studyCode).then((data) => {
            setMris(data);
            setLoading(false);
        });
    }, [studyCode]);

    const getStatusColor = (status: MriStatus) => {
        switch (status) {
            case 'InProgress':
                return 'yellow';
            case 'Finished':
                return 'green';
            case 'Validated':
                return 'darkgreen';
            case 'Sent':
                return 'blue';
            case 'Expired':
                return 'purple';
            default:
                return 'white';
        }
    };

    if (loading) {
        return <LoadingFullStops />;
    } else {
        if (mris === undefined) {
            return <p>Error loading mris !</p>;
        } else {
            // TODO: Set selectedId to the first available mri, and create it if it doesn't exist
            return (
                <div className="flex flex-col w-full items-center">
                    <ToggleGroup
                        type="single"
                        unselectable="off"
                        value="selectedId"
                        onValueChange={(newValue) => {
                            // TODO: Load correct MRI
                            if (newValue) setSelectedId(newValue);
                        }}
                    >
                        {mris.map((mri, i) => (
                            <ToggleGroupItem
                                value={mri.mriId ?? 'new_mri'}
                                key={i}
                                color={getStatusColor(mri.status)}
                            >
                                {mri.data.title ?? 'Untitled MRI'}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                    <BoxButtonPlus onClick={() => {}} bg-black />
                    <p>Selected item {selectedId}</p> {/* TODO: Remove */}
                </div>
            );
        }
    }
}

interface MriEditorContentProps {
    form: UseFormReturn<MriFormType>;
    serverMriId?: string;
    updateServer: () => void;
    status: MriStatus;
    study: string;
    setNotSaved: () => void;
    mriId: string | undefined;
}

function MriEditorContent({
    form,
    updateServer,
    setNotSaved,
    serverMriId,
    status,
    study,
    mriId,
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
                                storeMriData(mriId, study, form.watch()).then((updatedMriId) => {
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
