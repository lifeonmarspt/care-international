const group = (list, groupBy) => list.reduce((accumulator, current) => {
    if (!accumulator[current[groupBy]]) {
      accumulator[current[groupBy]] = [];
    }

    accumulator[current[groupBy]].push(current);

    return accumulator;
}, {});

const groupStories = (stories) => {
  const unique = (value, index, self) => (self.indexOf(value) === index);

  const groupedByStoryNumber = group(stories, "story_number");

  return Object.entries(groupedByStoryNumber).map(([storyNumber, stories]) => ({
    ...stories[0],
    outcome: stories.map(s => s.outcome).filter(unique),
    country: stories.map(s => s.country).filter(unique),
    iso: stories.map(s => s.iso).filter(unique),
  }));
};

export default groupStories;
