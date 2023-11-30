import { useState } from 'react';

export default function App() {
  const defaultAgenda = [
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

  const [agenda, setAgenda] = useState(defaultAgenda);
  const [showAgenda, setShowAgenda] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('');
  const [topics, setTopics] = useState([]);

  const isTitleValid = title.trim() !== '';
  const isDescriptionValid = description.trim() !== '';
  const isTopicValid = topic.trim() !== '';
  const isTopicsValid = topics.length !== 0;

  const isAddTopicBtnDisabled = !isTopicValid;
  const isSubmitAgendaBtnDisabled = !(
    isTitleValid &&
    isDescriptionValid &&
    isTopicsValid
  );

  // your methods here

  const handleTitleInputChange = e => {
    setTitle(e.target.value);
    console.log(e)
  };

  const handleDescriptionInputChange = e => {
    setDescription(e.target.value);
  };

  const handleTopicInputChange = e => {
    setTopic(e.target.value);
  };

  const toggleViewAgenda = e => {
    e.preventDefault();
    setShowAgenda(!showAgenda);
  };

  const handleAddTopic = e => {
    e.preventDefault();
    setTopics([...topics, topic]);
    setTopic('');
  };

  const handleSubmitAgenda = e => {
    e.preventDefault();
    if (topic) setTopics([...topics, topic]);
    setAgenda([...agenda, { title, description, topics }]);
    setTitle('');
    setDescription('');
    setTopic('');
    setTopics([]);
  };

  return (
    <div>
      <h1 className='mx-5 mb-5'>Agenda Manager</h1>
      {/** show/hide this following add agenda template */}
      {!showAgenda ? (
        <div className='container' role='addAgenda'>
          <button
            className='btn btn-info'
            role='goToView'
            onClick={toggleViewAgenda}
          >
            Click To View Agenda
          </button>
          <form>
            <div className='my-3'>
              <label htmlFor='' className='form-label'>
                Title
              </label>
              {/* title */}
              <input
                type='text'
                name='newTitle'
                placeholder='Enter the title'
                role='inputTitle'
                className='form-control'
                onChange={handleTitleInputChange}
                value={title}
              />
              <small className='text-danger' data-testid='invalidTitle'>
                {isTitleValid ? '' : 'Title is required'}
              </small>
            </div>

            <div className='my-3'>
              <label htmlFor='' className='form-label'>
                Description
              </label>
              {/* Description */}
              <input
                type='text'
                name='newDescription'
                placeholder='Enter the description'
                role='inputDescription'
                className='form-control'
                onChange={handleDescriptionInputChange}
                value={description}
              />
              <small className='text-danger' data-testid='invalidDescription'>
                {isDescriptionValid ? '' : 'Description is required'}
              </small>
            </div>

            <div className='my-3'>
              <label htmlFor='' className='form-label'>
                Topic
              </label>
              {/* Topic */}
              <input
                type='text'
                name='newTopic'
                placeholder='Enter the Topic'
                role='inputTopic'
                className='form-control'
                onChange={handleTopicInputChange}
                value={topic}
              />
              <small className='text-danger' data-testid='invalidTopic'>
                {isTopicsValid || isTopicValid ? '' : 'Topic is required'}
              </small>
            </div>

            {/** on click should add topics and disable the button if invalid topic*/}
            <button
              className='btn btn-success addAlign'
              role='addTopicBtn'
              disabled={isAddTopicBtnDisabled}
              onClick={handleAddTopic}
            >
              + Add Topic
            </button>

            {/** on click should add the agenda and disable the button if invalid inputs*/}
            <button
              className='btn btn-success submitAlign'
              role='submitAgendaBtn'
              disabled={isSubmitAgendaBtnDisabled}
              onClick={handleSubmitAgenda}
            >
              Submit Agenda
            </button>
          </form>

          {/**  show if no topics added yet*/}
          {!topics.length && (
            <div className='text-danger ml-2 mt-5' data-testid='noTopicsMsg'>
              No Topics Added
            </div>
          )}

          {/** display the list of topics added using li */}
          <div className='card my-3'>
            <div className='card-header'>Added Topics</div>
            <div className='card-body'>
              <ul className='list-group' role='topicList'>
                {topics.map((topic, i) => (
                  <li className='list-group-item' key={i}>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
            <div className='card-footer'>Refer the topics you added</div>
          </div>
        </div>
      ) : (
        <div className='container' role='viewAgenda'>
          <button
            className='btn btn-info'
            role='goToAdd'
            onClick={toggleViewAgenda}
          >
            Click to Add Agenda
          </button>
          {/** iterate the agenda details to display */}
          {agenda.map((agenda, i) => (
            <div className='card my-3' role='cards' key={i}>
              <div className='card-header'>{agenda.title}</div>
              <div className='card-body'>
                <ul className='list-group'>
                  {/** iterate the topics to display */}
                  {agenda.topics.map((topic, j) => (
                    <li className='list-group-item' key={j}>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
              <div className='card-footer'>{agenda.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
