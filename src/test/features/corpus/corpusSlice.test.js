import corpusReducer, {
  setCorpusData,
  addCorpusEntry,
  updateCorpusEntry,
  deleteCorpusEntry,
  resetCorpus,
} from '../../../src/features/corpus/corpusSlice';

describe('corpusSlice', () => {
  const initialState = {
    corpusData: [],
    status: 'idle',
    error: null,
  };

  it('should return the initial state', () => {
    expect(corpusReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle setCorpusData', () => {
    const newCorpusData = [{ id: '1', name: 'Test Corpus' }];
    expect(corpusReducer(initialState, setCorpusData(newCorpusData))).toEqual({
      ...initialState,
      corpusData: newCorpusData,
    });
  });

  it('should handle addCorpusEntry', () => {
    const newEntry = { id: '2', name: 'New Entry' };
    const stateWithExistingData = {
      ...initialState,
      corpusData: [{ id: '1', name: 'Test Corpus' }],
    };
    expect(corpusReducer(stateWithExistingData, addCorpusEntry(newEntry))).toEqual({
      ...initialState,
      corpusData: [{ id: '1', name: 'Test Corpus' }, newEntry],
    });
  });

  it('should handle updateCorpusEntry', () => {
    const updatedEntry = { id: '1', name: 'Updated Corpus' };
    const stateWithExistingData = {
      ...initialState,
      corpusData: [{ id: '1', name: 'Test Corpus' }],
    };
    expect(corpusReducer(stateWithExistingData, updateCorpusEntry(updatedEntry))).toEqual({
      ...initialState,
      corpusData: [updatedEntry],
    });
  });

  it('should handle deleteCorpusEntry', () => {
    const stateWithExistingData = {
      ...initialState,
      corpusData: [{ id: '1', name: 'Test Corpus' }, { id: '2', name: 'Another Corpus' }],
    };
    expect(corpusReducer(stateWithExistingData, deleteCorpusEntry('1'))).toEqual({
      ...initialState,
      corpusData: [{ id: '2', name: 'Another Corpus' }],
    });
  });

  it('should handle resetCorpus', () => {
    const stateWithData = {
      corpusData: [{ id: '1', name: 'Test Corpus' }],
      status: 'succeeded',
      error: 'some error',
    };
    expect(corpusReducer(stateWithData, resetCorpus())).toEqual(initialState);
  });
});