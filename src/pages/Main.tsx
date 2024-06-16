"use client";
import { StoriesList } from "@/app/types/stories";
import { fetchStories } from "@/app/utils/fetch-stories";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import StoriesModal from "../app/components/stories/StoriesModal";

const StoryThumbnail = styled.div`
  width: 100px;
  height: 100px;
  min-width: 100px;
  background-size: cover;
  background-position: center;
  margin: 10px;
  cursor: pointer;
  border-radius: 50%;
`;

const StoriesGrid = styled.div`
display: flex;
width: 100%;
flex: 1;
min-width: 0;
overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const MainWrapper = styled.div`
display: flex;
width: 100%;
height: 100%;
align-items: center;
overflow-x: hidden;
padding: 0 15px;
`;

const HomePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
    const [stories, setStories] = useState<StoriesList>([]);
  
    useEffect(() => {
      const getStories = async () => {
        const storiesData = await fetchStories();
        setStories(storiesData);
      };
  
      getStories();
    }, []);
  
    const handleStoryClick = (index:number) => {
      setSelectedStoryIndex(index);
      setIsModalOpen(true);
    };

  return (
    <MainWrapper>
     <StoriesGrid>
        {stories.map((story, index) => (
          <StoryThumbnail
            key={story.id}
            style={{ backgroundImage: `url(${story.thumbnailUrl})` }}
            onClick={() => handleStoryClick(index)}
          />
        ))}
      </StoriesGrid>
      <StoriesModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        initialIndex={selectedStoryIndex}
        stories={stories}
      />
    </MainWrapper>
  );
};

export default HomePage;
