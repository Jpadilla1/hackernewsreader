import { Machine, sendParent } from 'xstate';
import Axios from 'axios';

const getStoryById = (id) => Axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);

export const loadStory = (id) => Machine({
    initial: 'pending',
    states: {
        pending: {
            invoke: {
                src: () => getStoryById(id),
                onDone: 'success',
                onError: 'error'
            }
        },
        success: {
            onEntry: 'sendEvent',
            type: 'final'
        },
        error: {
            onEntry: 'logError',
            type: 'final',
        }
    }
}, {
    actions: {
        sendEvent: sendParent((_, event) => ({
            type: 'loadStorySuccess',
            payload: event.data.data,
        })),
        logError: (_, event) => {
            console.log('Error occurred: ', event.data);
        }
    }
});
