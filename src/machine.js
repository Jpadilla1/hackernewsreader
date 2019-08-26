import { Machine, assign, spawn } from 'xstate';
import Axios from 'axios';
import { loadStory } from './loadStory';

const ITEMS_PER_PAGE = 10;

const getAllStories = () => Axios.get('https://hacker-news.firebaseio.com/v0/newstories.json');

export const machine = Machine({
    initial: 'loadingAllStories',
    context: {
        allStories: [],
    },
    states: {
        loadingAllStories: {
            invoke: {
                src: getAllStories,
                onDone: {
                    target: 'fillScreen',
                    actions: 'setAllStories'
                }
            }
        },
        fillScreen: {
            onEntry: 'loadToFillScreen',
            on: {
                loadStorySuccess: {
                    actions: 'saveStoryContent'
                }
            }
        },
    }
}, {
    actions: {
        setAllStories: assign((_, evt) => ({ allStories: evt.data.data })),
        loadToFillScreen: assign((ctx, e) => {
            ctx.allStories.slice(0, ITEMS_PER_PAGE + 1).forEach(id => {
                spawn(loadStory(id));
            });
        }),
        saveStoryContent: assign((ctx, { payload }) => {
            const index = ctx.allStories.indexOf(payload.id);

            ctx.allStories[index] = payload;

            return {
                ...ctx,
                allStories: ctx.allStories
            };
        }),
    }
});
