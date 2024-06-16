'use client'
import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';
import Image from 'next/image';
import { StoriesList } from '@/app/types/stories';

const StoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #000;
  color: #fff;
  overflow: hidden;
  position: relative;
`;

const Story = styled(animated.div)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
`;

const ProgressBarContainer = styled.div`
  position: absolute;
  top: 10px;
  width: 90%;
  display: flex;
  justify-content: space-between;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 3px;
  margin: 0 2px;
  background: rgba(255, 255, 255, 0.5);
  &.active {
    background: #fff;
  }
`;
interface Props {
    left?: boolean;
}
const StoryButton = styled.button<Props>`
  position: absolute;
  top: 50%;
  ${props => (props.left ? 'left: 10px;' : 'right: 10px;')}
  transform: translateY(-50%);
  color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 1;
  border-radius: 50%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 2;
  border-radius: 50%;
  font-size: 16px;
`;



const StoriesModal = ({ isOpen, onRequestClose, initialIndex = 0, stories }: {
    isOpen: boolean;
    onRequestClose: () => void;
    initialIndex: number;
    stories: StoriesList
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const timeoutRef = useRef<any>(null);

    const [props, set] = useSpring(() => ({
        opacity: 1,
        config: { duration: 500 }
    }));

    useEffect(() => {
        const currentStory = stories[currentIndex];
        setProgress(0);
        clearTimeout(timeoutRef.current);

        if (!isPaused) {
            timeoutRef.current = setTimeout(() => {
                nextStory();
            }, 5000);
        }

        return () => clearTimeout(timeoutRef.current);
    }, [currentIndex, isPaused, stories]);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setProgress(prev => (prev < 100 ? prev + 1 : prev));
        }, 50);

        return () => clearInterval(interval);
    }, [currentIndex, isPaused]);

    const nextStory = () => {
        set({
            opacity: 0, onRest: () => {
                setCurrentIndex((currentIndex + 1) % stories.length);
                set({ opacity: 1 });
            }
        });
    };

    const prevStory = () => {
        set({
            opacity: 0, onRest: () => {
                setCurrentIndex((currentIndex - 1 + stories.length) % stories.length);
                set({ opacity: 1 });
            }
        });
    };

    const handlePauseToggle = () => {
        setIsPaused(!isPaused);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Stories"
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    height: '90%',
                    backgroundColor: 'black',
                    padding: '0',
                    border: 'none',
                    borderRadius: '10px',
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                },
            }}
        >
            <StoryContainer>
                <ProgressBarContainer>
                    {stories.map((_, index) => (
                        <ProgressBar
                            key={index}
                            className={index === currentIndex ? 'active' : ''}
                            style={{ width: `${index === currentIndex ? progress : 100}%` }}
                        />
                    ))}
                </ProgressBarContainer>
                <StoryButton left={true} onClick={prevStory}>‹</StoryButton>
                <StoryButton onClick={nextStory}>›</StoryButton>
                <CloseButton onClick={onRequestClose}>×</CloseButton>
                <Story style={{ ...props }}>
                    <Image
                        src={`${stories[currentIndex]?.url}.png`}
                        alt={stories[currentIndex]?.title}
                        layout="fill"
                        objectFit="cover"
                    />
                    <div style={{ position: 'absolute', bottom: '20px', color: 'white', textAlign: 'center' }}>
                        {stories[currentIndex]?.title}
                    </div>
                </Story>

            </StoryContainer>
        </Modal>
    );
};

export default StoriesModal;
