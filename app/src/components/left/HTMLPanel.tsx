import React, { useState, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import StateContext from '../../context/context';
import HTMLItem from './HTMLItem';
import { makeStyles } from '@material-ui/core/styles';

/*
DESCRIPTION: This is the bottom half of the left panel, starting from the 'HTML
  Elements' header. The boxes containing each HTML element are rendered in
  HTMLItem, which itself is rendered by this component.

Central state contains all available HTML elements (stored in the HTMLTypes property).
  The data for HTMLTypes is stored in HTMLTypes.tsx and is added to central state in
  initialState.tsx.

Hook state:
  -tag: 
*/

const HTMLPanel = (): JSX.Element => {
  const classes = useStyles();
  const [tag, setTag] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errorStatus, setErrorStatus] = useState(false);
  const [state, dispatch] = useContext(StateContext);

  let startingID = 0;
  state.HTMLTypes.forEach(element => {
    if (element.id >= startingID) startingID = element.id;
  });
  startingID += 1;

  const [currentID, setCurrentID] = useState(startingID);

  const buttonClasses =
    'MuiButtonBase-root MuiButton-root MuiButton-text makeStyles-button-12 MuiButton-textPrimary';

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetError();
    setTag(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetError();
    setName(e.target.value);
  };

  const checkNameDupe = (inputName: String): boolean => {
    let checkList = state.HTMLTypes.slice();

    // checks to see if inputted comp name already exists
    let dupe = false;
    checkList.forEach(HTMLTag => {
      if (
        HTMLTag.name.toLowerCase() === inputName.toLowerCase() ||
        HTMLTag.tag.toLowerCase() === inputName.toLowerCase()
      ) {
        dupe = true;
      }
    });
    return dupe;
  };

  const triggerError = (type: String) => {
    setErrorStatus(true);
    if (type === 'empty') {
      setErrorMsg('Tag/ Tag name cannot be blank.');
    } else if (type === 'dupe') {
      setErrorMsg('Tag/ Tag name already exists.');
    } else if (type === 'letters') {
      setErrorMsg('Tag/ Tag name must start with a letter.');
    } else if (type === 'symbolsDetected') {
      setErrorMsg('Tag/ Tag name must not contain symbols.');
    }
  };

  const resetError = () => {
    setErrorStatus(false);
  };

  const createOption = (inputTag: String, inputName: String) => {
    // format name so first letter is capitalized and there are no whitespaces
    let inputNameClean = inputName.replace(/\s+/g, '');
    const formattedName =
      inputNameClean.charAt(0).toUpperCase() + inputNameClean.slice(1);
    // add new component to state
    const newElement = {
      id: currentID,
      tag: inputTag,
      name: formattedName,
      style: {},
      placeHolderShort: name,
      placeHolderLong: '',
      icon: null
    };
    dispatch({
      type: 'ADD ELEMENT',
      payload: newElement
    });
    setCurrentID(currentID + 1);
    setTag('');
    setName('');
  };

  const alphanumeric = (input: string): boolean => {
    let letterNumber = /^[0-9a-zA-Z]+$/;
    if (input.match(letterNumber)) return true;
    return false;
  };

  const handleSubmit = e => {
    e.preventDefault();
    let letters = /[a-zA-Z]/;
    if (!tag.charAt(0).match(letters) || !name.charAt(0).match(letters)) {
      triggerError('letters');
      return;
    } else if (!alphanumeric(tag) || !alphanumeric(name)) {
      triggerError('symbolsDetected');
      return;
    } else if (tag.trim() === '' || name.trim() === '') {
      triggerError('empty');
      return;
    } else if (checkNameDupe(tag) || checkNameDupe(name)) {
      triggerError('dupe');
      return;
    }
    createOption(tag, name);
    resetError();
  };

  const handleDelete = (id: number): void => {
    dispatch({
      type: 'DELETE ELEMENT',
      payload: id
    });
  };
  // filter out separator so that it will not appear on the html panel
const htmlTypesToRender = state.HTMLTypes.filter(type => type.name !== 'separator')
  return (
    <div className="HTMLItems">
      <Grid
          // container
          // spacing={1}
          // direction='column'
          // justify='center'
          // alignItems='center'
          id="HTMLItemsGrid"
        >
          {htmlTypesToRender.map(option => (
            <HTMLItem
              name={option.name}
              key={`html-${option.name}`}
              id={option.id}
              Icon={option.icon}
              handleDelete={handleDelete}
            />
          ))}
        </Grid>
      <div className="lineDiv">
        <hr
          style={{
            borderColor: '#f5f5f5',
            borderStyle: 'solid',
            color: '#f5f5f5',
            backgroundColor: 'white',
            height: '0.5px',
            width: '100%',
            marginLeft: '0px'
          }}
        />
      </div>
      <div className={classes.addComponentWrapper}>
        <div className={classes.inputWrapper}>
          <form onSubmit={handleSubmit} className="customForm">
            <h5>New Element: </h5>
            <label className={classes.inputLabel}>
              Tag:
            </label>
              <input
                color={'primary'}
                type="text"
                name="Tag"
                value={tag}
                onChange={handleTagChange}
                className={classes.input}
                style={{ marginBottom: '10px' }}
              />
              {errorStatus && <span>{errorMsg}</span>}
            <br></br>
            <label className={classes.inputLabel}>
              Element Name:
            </label>
            <input
              color={'primary'}
              type="text"
              name="Tag Name"
              value={name}
              onChange={handleNameChange}
              className={classes.input}
            />
            {errorStatus && <span>{errorMsg}</span>}           
            <input
              // className={buttonClasses}
              className={classes.addElementButton}
              id="submitButton"
              // color="primary"
              type="submit"
              value="Add Element"
              // style={{ marginLeft: '-5px', borderRadius: 25, width: '110px', textAlign: 'center', fontSize: '80%' }}
            />
          </form>
        </div>
      </div>
        {/* <Grid
          // container
          // spacing={1}
          // direction='column'
          // justify='center'
          // alignItems='center'
        >
          {htmlTypesToRender.map(option => (
            <HTMLItem
              name={option.name}
              key={`html-${option.name}`}
              id={option.id}
              Icon={option.icon}
              handleDelete={handleDelete}
            />
          ))}
        </Grid> */}
    </div>
  );
};

const useStyles = makeStyles({
  inputWrapper: {
    // height: '115px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingLeft: '35px',
    marginBottom: '15px',
    width: '100%'
  },
  addComponentWrapper: {
    // border: '1px solid rgba(70,131,83)',
    //----------------------------------CHANGED---------------------------------------
    // border: '1px solid rgba(247, 167, 62, 0.45)',
    // padding: '20px',
    // margin: '20px',
    width: '100%',
    margin: '5px 0px 0px 0px'
  },
  input: {
    color: '#77b6ed',
    borderRadius: '5px',
    // paddingLeft: '15px',
    // paddingRight: '10px',
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    // border: '1px solid rgba(51,235,145,0.75)',
    backgroundColor: 'rgba(255,255,255,0.15)',
    margin: '0px 0px 0px 10px',
    width: '140px',
    height: '30px'
  },
  inputLabel: {
    fontSize: '85%',
    zIndex: 20,
    color: '#77b6ed',
    margin: '-10px 0px -10px 0px',
    width: '125%'
  },
  addElementButton: {
    color: '#77b6ed',
    backgroundColor: 'transparent',
    height: '40px',
    width: '105px',
    fontFamily: '"Raleway", sans-serif',
    fontSize: '85%',
    textAlign: 'center',
    // margin: '5px auto',
    marginLeft: '75px',
    // border: '1px solid rgba(225, 225, 225, 1.0)',
    borderStyle: 'none',
    transition: '0.3s',
    borderRadius: '25px',
    // cursor: 'grab',
    // '& > h3': {
    //   display: 'inline-block'
    //   }
    }
});

export default HTMLPanel;
