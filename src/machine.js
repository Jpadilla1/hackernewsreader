import { Machine, assign, spawn } from "xstate";
import Axios from "axios";
import { loadStory } from "./loadStory";

const HEADER_SIZE = 44; // in px
const ITEM_SIZE = 38; // in px
const LOAD_MORE_MAX = 10;

const getAllStories = () =>
  Axios.get("https://hacker-news.firebaseio.com/v0/newstories.json");

function getScrollPercent() {
  var h = document.documentElement,
    b = document.body,
    st = "scrollTop",
    sh = "scrollHeight";
  return ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
}

export const machine = Machine(
  {
    initial: "loadingAllStories",
    context: {
      allStories: [],
      initialItemsLoadedCount: 0,
      initialItemsMaxCount:
        parseInt((window.innerHeight - HEADER_SIZE) / ITEM_SIZE, 0) + 1,
      loadMoreCount: 0,
    },
    states: {
      loadingAllStories: {
        invoke: {
          src: getAllStories,
          onDone: {
            target: "fillScreen",
            actions: "setAllStories"
          }
        }
      },
      fillScreen: {
        onEntry: "loadToFillScreen",
        on: {
          loadStorySuccess: [
            {
              actions: ["saveStoryContent", "incrementInitialLoadCount"],
              cond: "isUnderMax"
            },
            {
              actions: "saveStoryContent",
              target: "idle"
            }
          ]
        }
      },
      idle: {
        on: {
          scroll: {
            cond: "shouldLoadMore",
            target: "loadMore"
          }
        }
      },
      loadMore: {
        onEntry: "loadMoreStories",
        on: {
          loadStorySuccess: [
            {
              actions: ["saveStoryContent", "incrementLoadMoreCount"],
              cond: "isUnderLoadMoreCount"
            },
            {
              actions: ["saveStoryContent", "resetLoadMoreCounter"],
              target: "idle"
            }
          ]
        }
      }
    }
  },
  {
    actions: {
      setAllStories: assign((_, evt) => ({ allStories: evt.data.data })),
      loadToFillScreen: assign(ctx => {
        const size = parseInt(
          (window.innerHeight - HEADER_SIZE) / ITEM_SIZE,
          0
        );

        ctx.allStories.slice(0, size + 2).forEach(id => {
          spawn(loadStory(id));
        });
      }),
      loadMoreStories: assign(ctx => {
        ctx.allStories
          .filter(s => typeof s !== "object")
          .slice(0, LOAD_MORE_MAX + 1)
          .forEach(id => {
            spawn(loadStory(id));
          });
      }),
      saveStoryContent: assign((ctx, event) => {
        if (event.payload) {
          const index = ctx.allStories.indexOf(event.payload.id);

          ctx.allStories[index] = event.payload;

          return {
            ...ctx,
            allStories: ctx.allStories
          };
        }
      }),
      resetLoadMoreCounter: assign((_) => ({
        loadMoreCount: 0,
      })),
      incrementInitialLoadCount: assign(ctx => ({
        initialItemsLoadedCount: ctx.initialItemsLoadedCount + 1,
      })),
      incrementLoadMoreCount: assign(ctx => ({
        loadMoreCount: ctx.loadMoreCount + 1,
      }))
    },
    guards: {
      isUnderMax: ctx => ctx.initialItemsLoadedCount < ctx.initialItemsMaxCount,
      isUnderLoadMoreCount: ctx => ctx.loadMoreCount < LOAD_MORE_MAX,
      shouldLoadMore: () => getScrollPercent() > 95
    }
  }
);
