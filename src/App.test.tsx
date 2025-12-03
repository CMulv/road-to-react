import { describe, it, expect, vi } from "vitest";
import {
  storiesReducer,
  type StoriesRemoveAction,
  type StoriesFetchInitAction,
  type StoriesFetchSuccessAction,
  type StoriesFetchFailureAction,
  Item,
  SearchForm,
} from "./App";
import { fireEvent, render, screen } from "@testing-library/react";

const storyOne = {
  title: "React",
  url: "https://react.dev/",
  author: "Jordan Walke",
  num_comments: 3,
  points: 4,
  objectID: 0,
};

const storyTwo = {
  title: "Redux",
  url: "https://redux.js.org/",
  author: "Dan Abramov, Andrew Clark",
  num_comments: 2,
  points: 5,
  objectID: 1,
};

const stories = [storyOne, storyTwo];

describe("storiesReducer", () => {
  it("initializes a fetch for stories data", () => {
    const action: StoriesFetchInitAction = {
      type: "STORIES_FETCH_INIT",
    };
    const state = { data: [], isLoading: false, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: [],
      isLoading: true,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  it("succeeds on a stories data fetch", () => {
    const action: StoriesFetchSuccessAction = {
      type: "STORIES_FETCH_SUCCESS",
      payload: stories,
    };
    const state = { data: [], isLoading: false, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: stories,
      isLoading: false,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  it("fails on a stories data fetch", () => {
    const action: StoriesFetchFailureAction = {
      type: "STORIES_FETCH_FAILURE",
    };
    const state = { data: [], isLoading: false, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: [],
      isLoading: false,
      isError: true,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  it("removes a story from all stories", () => {
    const action: StoriesRemoveAction = {
      type: "REMOVE_STORY",
      payload: storyOne,
    };
    const state = { data: stories, isLoading: false, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: [storyTwo],
      isLoading: false,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });
});

describe("Item", () => {
  it("renders all properties", () => {
    render(<Item item={storyOne} onRemoveItem={() => {}} />);

    expect(screen.getByText("Jordan Walke")).toBeInTheDocument();
    expect(screen.getByText("React")).toHaveAttribute(
      "href",
      "https://react.dev/"
    );
  });

  it("renders a clickable dismiss button", () => {
    render(<Item item={storyOne} onRemoveItem={() => {}} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("clicking the dismiss button calls the callback handler", () => {
    const handleRemoveItem = vi.fn();

    render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);

    fireEvent.click(screen.getByRole("button"));

    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
  });
});

describe("SearhcForm", () => {
  const searchFormProps = {
    searchTerm: "React",
    onSearchInput: vi.fn(),
    searchAction: vi.fn(),
  };

  it("renders the input field with its value", () => {
    render(<SearchForm {...searchFormProps} />);

    expect(screen.getByDisplayValue("React")).toBeInTheDocument();
  });

  it("renders the correct label", () => {
    render(<SearchForm {...searchFormProps} />);

    expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
  });

  it("calls onSearchInupt on input field change", () => {
    render(<SearchForm {...searchFormProps} />);

    fireEvent.change(screen.getByDisplayValue("React"), {
      target: { value: "Redux" },
    });

    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
  });

  it("calls searchAction on button submit click", () => {
    render(<SearchForm {...searchFormProps} />);

    fireEvent.click(screen.getByRole("button"));

    expect(searchFormProps.searchAction).toHaveBeenCalledTimes(1);
  });
});
