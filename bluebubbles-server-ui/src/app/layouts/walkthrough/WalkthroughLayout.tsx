import React, { useEffect, useState } from 'react';
import {
    Box,
    Divider,
    Stack,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
    Button,
    Flex,
    useColorModeValue
} from '@chakra-ui/react';
import { IntroWalkthrough } from './intro/IntroWalkthrough';
import { ConnectionWalkthrough } from './connection/ConnectionWalkthrough';
import { PrivateApiWalkthrough } from './privateApi/PrivateApiWalkthrough';
import { ConfigurationsWalkthrough } from './configurations/ConfigurationsWalkthrough';
import { PermissionsWalkthrough } from './permissions/PermissionsWalkthrough';
import { NotificationsWalkthrough } from './notifications/NotificationsWalkthrough';
import { useAppSelector } from '../../hooks';
import { toggleTutorialCompleted } from '../../actions/GeneralActions';

type StepItem = {
    component: React.FunctionComponent<any>,
    dependencies: Array<string>
};

export const WalkthroughLayout = ({...rest}): JSX.Element => {
    const [step, setStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([] as Array<number>);
    const proxyService: string = useAppSelector(state => state.config.proxy_service ?? '');
    const password: string = useAppSelector(state => state.config.password ?? '');
    
    // Links walkthrough steps and the values they rely on to be completed
    const steps: Array<StepItem> = [
        {
            component: IntroWalkthrough,
            dependencies: []
        },
        {
            component: PermissionsWalkthrough,
            dependencies: []
        },
        {
            component: NotificationsWalkthrough,
            dependencies: []
        },
        {
            component: ConnectionWalkthrough,
            dependencies: [proxyService, password]
        },
        {
            component: PrivateApiWalkthrough,
            dependencies: []
        },
        {
            component: ConfigurationsWalkthrough,
            dependencies: []
        }
    ];

    const CurrentStep = steps[step].component;
    const requiresDependencies = steps[step].dependencies.filter(e => e.length > 0).length !== steps[step].dependencies.length;
    const showNext = step < steps.length && !requiresDependencies;
    const showPrevious = step > 0;

    // Make sure we start at the top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Box p={3} {...rest}>
            <Box mb='80px'>
                <CurrentStep onComplete={() => {
                    setCompletedSteps([...completedSteps, step]);
                }}/>
            </Box>
            <Box position='fixed' bottom={0} left={0} width='100%' height='80px' bg={useColorModeValue('white', 'gray.900')}>
                <Divider />
                <Flex justifyContent='space-between' alignItems='center' mx={5}>
                    <Button
                        disabled={!showPrevious}
                        mt='20px'
                        onClick={() => setStep(step - 1)}
                    >
                        &lt; Back
                    </Button>
                    <Stack width='70%'>
                        <Slider aria-label='slider-ex-6' isReadOnly={true} value={step * 20}>
                            <SliderMark value={0} mt='3' ml='-3.5' fontSize='sm'>
                                Intro
                            </SliderMark>
                            <SliderMark value={20} mt='3' ml='-9' fontSize='sm'>
                                Permissions
                            </SliderMark>
                            <SliderMark value={40} mt='3' ml='-10' fontSize='sm'>
                                Notifications
                            </SliderMark>
                            <SliderMark value={60} mt='3' ml='-9' fontSize='sm'>
                                Connection
                            </SliderMark>
                            <SliderMark value={80} mt='3' ml='-9' fontSize='sm'>
                                Private API
                            </SliderMark>
                            <SliderMark value={100} mt='3' ml='-5' fontSize='sm'>
                                Finish
                            </SliderMark>
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </Stack>
                    <Button
                        disabled={!showNext}
                        mt='20px'
                        colorScheme='blue'
                        onClick={() => {
                            if (step === steps.length - 1) {
                                toggleTutorialCompleted(true);
                            } else {
                                setStep(step + 1);
                            }
                            
                        }}
                    >
                        {step === steps.length - 1 ? 'Finish' : 'Next'} &gt;
                    </Button>
                </Flex>
            </Box>
        </Box>
    );
};