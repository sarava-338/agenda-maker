import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import App from '../App';

const mockAgenda = [
  {
    title: 'Angular',
    description: 'Some description about the angular',
    topics: [
      'Introduction',
      'Typescript',
      'Why Angular?',
      'Understanding Versions',
      'Fundmentals',
    ],
  },
  {
    title: 'Vue',
    description: 'Some description about the vue',
    topics: [
      'Introduction',
      'Javascript',
      'Why vue?',
      'Vue Bindings',
      'Component Interaction',
    ],
  },
];

const addNewData = {
  title: 'react',
  description: 'react description',
  topics: ['Introduction', 'Why React?', 'Types of Components'],
};

const addNewData1 = {
  title: 'Java',
  description: 'java description',
  topics: ['Introduction', 'java basics', 'OOPs concepts', 'Frameworks'],
};

const addNewData2 = {
  title: 'Python',
  description: 'python description',
  topics: [
    'Introduction',
    'python basics',
    'Frameworks',
    'python in data science',
    'Why Python?',
  ],
};

const dispatchInput = (selector, value) => {
  userEvent.type(screen.queryByRole(selector), value);
};

const getIdText = selector => screen.getByTestId(selector).textContent.trim();

const addTopic = (inputElm, value) => {
  userEvent.type(inputElm, value);
  fireEvent.click(screen.queryByRole('addTopicBtn'));
};

const getText = (elm, selector) =>
  elm.querySelector(selector).textContent.trim();

const getText2 = elm => elm.textContent.trim();

beforeEach(() => {
  render(<App />);
});

test('1. Should display initial UI', async () => {
  await waitFor(() => screen.queryByRole('addAgenda'));
  expect(screen.queryByRole('viewAgenda')).not.toBeInTheDocument();
  expect(screen.queryByRole('addAgenda')).toBeInTheDocument();
  expect(screen.queryByRole('addTopicBtn')).toBeDisabled();
  expect(screen.queryByRole('submitAgendaBtn')).toBeDisabled();
  expect(screen.queryByTestId('noTopicsMsg')).toBeInTheDocument();
});

test('2. form validation - invalid', async () => {
  dispatchInput('inputTitle', ' ');
  expect(getIdText('invalidTitle')).toEqual('Title is required');

  dispatchInput('inputDescription', '  ');
  expect(getIdText('invalidDescription')).toEqual('Description is required');

  dispatchInput('inputTopic', '    ');
  expect(getIdText('invalidTopic')).toEqual('Topic is required');

  expect(screen.queryByRole('addTopicBtn')).toBeDisabled();
  expect(screen.queryByRole('submitAgendaBtn')).toBeDisabled();
});

test('3. form validation - valid add btn', async () => {
  dispatchInput('inputTitle', ' ');
  expect(getIdText('invalidTitle')).toEqual('Title is required');

  dispatchInput('inputDescription', '  ');
  expect(getIdText('invalidDescription')).toEqual('Description is required');

  dispatchInput('inputTopic', addNewData.topics[0]);
  expect(getIdText('invalidTopic')).toEqual('');

  expect(screen.queryByRole('addTopicBtn')).not.toBeDisabled();
  expect(screen.queryByRole('submitAgendaBtn')).toBeDisabled();
});

test('4. form validation - invalid submit', async () => {
  dispatchInput('inputTitle', addNewData.title);
  expect(getIdText('invalidTitle')).toEqual('');

  dispatchInput('inputDescription', addNewData.description);
  expect(getIdText('invalidDescription')).toEqual('');

  dispatchInput('inputTopic', addNewData.topics[0]);
  expect(getIdText('invalidTopic')).toEqual('');

  expect(screen.queryByRole('addTopicBtn')).not.toBeDisabled();
  expect(screen.queryByRole('submitAgendaBtn')).toBeDisabled();
});

test('5. form validation - valid submit', async () => {
  dispatchInput('inputTitle', addNewData.title);
  expect(getIdText('invalidTitle')).toEqual('');

  dispatchInput('inputDescription', addNewData.description);
  expect(getIdText('invalidDescription')).toEqual('');

  addTopic(screen.queryByRole('inputTopic'), addNewData.topics[0]);
  expect(getIdText('invalidTopic')).toEqual('');
  expect(screen.queryByTestId('noTopicsMsg')).not.toBeInTheDocument();

  expect(screen.queryByRole('addTopicBtn')).toBeDisabled();
  expect(screen.queryByRole('submitAgendaBtn')).toBeDisabled();
});

test('6. toggle view check', async () => {
  fireEvent.click(screen.queryByRole('goToView'));
  await waitFor(() => screen.queryByRole('viewAgenda'));

  expect(screen.queryByRole('addAgenda')).not.toBeInTheDocument();
  expect(screen.queryByRole('viewAgenda')).toBeInTheDocument();

  fireEvent.click(screen.queryByRole('goToAdd'));
  await waitFor(() => screen.queryByRole('addAgenda'));

  expect(screen.queryByRole('viewAgenda')).not.toBeInTheDocument();
  expect(screen.queryByRole('addAgenda')).toBeInTheDocument();
});

test('7. check form inputs', async () => {
  const topicInput = screen.queryByRole('inputTopic');

  addTopic(topicInput, addNewData.topics[0]);
  let data = screen.queryByRole('topicList');
  expect(data[0].textContent).toEqual(addNewData.topics[0]);
  expect(topicInput).toHaveValue('');

  addTopic(topicInput, addNewData.topics[1]);
  data = screen.queryByRole('topicList');
  expect(data[0].textContent).toEqual(addNewData.topics[1]);
  expect(topicInput).toHaveValue('');

  addTopic(topicInput, addNewData.topics[2]);
  data = screen.queryByRole('topicList');
  expect(data[0].textContent).toEqual(addNewData.topics[2]);
  expect(topicInput).toHaveValue('');
});

test('8. check view Agenda', async () => {
  fireEvent.click(screen.queryByRole('goToView'));
  await waitFor(() => screen.queryByRole('viewAgenda'));
  const data = screen.queryByRole('cards');
  for (let i = 0; i < 2; i++) {
    expect(getText(data[i], '.card-header')).toEqual(mockAgenda[i].title);
    expect(getText(data[i], '.card-footer')).toEqual(mockAgenda[i].description);
    let lis = data[i].querySelectorAll('li');
    for (let j = 0; j < mockAgenda[i].topics.length; j++)
      expect(getText2(lis[j])).toEqual(mockAgenda[i].topics[j]);
  }
});

test('9. add and view agenda - 1', async () => {
  const titleInput = screen.queryByRole('inputTitle');
  const descriptionInput = screen.queryByRole('inputDescription');
  const topicInput = screen.queryByRole('inputTopic');

  userEvent.type(titleInput, addNewData.title);
  userEvent.type(descriptionInput, addNewData.description);
  addTopic(topicInput, addNewData.topics[0]);
  addTopic(topicInput, addNewData.topics[1]);
  addTopic(topicInput, addNewData.topics[2]);

  fireEvent.click(screen.queryByRole('submitAgendaBtn'));
  fireEvent.click(screen.queryByRole('goToView'));
  await waitFor(() => screen.queryByRole('viewAgenda'));

  const data = screen.queryByRole('cards');
  expect(getText(data[2], '.card-header')).toEqual(addNewData.title);
  expect(getText(data[2], '.card-footer')).toEqual(addNewData.description);
  let lis = data[2].querySelectorAll('li');
  for (let j = 0; j < addNewData.topics.length; j++)
    expect(getText2(lis[j])).toEqual(addNewData.topics[j]);
});

test('10. add and view agenda - 2', async () => {
  const titleInput = screen.queryByRole('inputTitle');
  const descriptionInput = screen.queryByRole('inputDescription');
  const topicInput = screen.queryByRole('inputTopic');

  userEvent.type(titleInput, addNewData1.title);
  userEvent.type(descriptionInput, addNewData1.description);
  addNewData1.topics.forEach(topic => {
    addTopic(topicInput, topic);
  });
  fireEvent.click(screen.queryByRole('submitAgendaBtn'));

  userEvent.type(titleInput, addNewData2.title);
  userEvent.type(descriptionInput, addNewData2.description);
  addNewData2.topics.forEach(topic => {
    addTopic(topicInput, topic);
  });
  fireEvent.click(screen.queryByRole('submitAgendaBtn'));

  fireEvent.click(screen.queryByRole('goToView'));
  await waitFor(() => screen.queryByRole('viewAgenda'));

  const data = screen.queryByRole('cards');

  let lis1 = data[2].querySelectorAll('li');
  expect(getText(data[2], '.card-header')).toEqual(addNewData1.title);
  expect(getText(data[2], '.card-footer')).toEqual(addNewData1.description);
  for (let j = 0; j < addNewData1.topics.length; j++)
    expect(getText2(lis1[j])).toEqual(addNewData1.topics[j]);

  let lis2 = data[3].querySelectorAll('li');
  expect(getText(data[3], '.card-header')).toEqual(addNewData2.title);
  expect(getText(data[3], '.card-footer')).toEqual(addNewData2.description);
  for (let j = 0; j < addNewData2.topics.length; j++)
    expect(getText2(lis2[j])).toEqual(addNewData2.topics[j]);
});
