import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // import bootstrap

const Bots = () => {
  const [time, setTime] = useState(0);

  const [reset, setReset] = useState(false);

  const [hasMounted, setHasMounted] = useState(false);
  const [getText, setGetText] = useState(false);
  const [showText, setShowText] = useState(false);

  const [toType, setToType] = useState('');
  const [splitToType, setSplitToType] = useState(null);

  const [typed, setTyped] = useState('');
  const [splitTyped, setSplitTyped] = useState(['']);

  const [displayText, setDisplayText] = useState(['']);

  const [wrongWords, setWrongWords] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [isRunning, setIsRunning] = useState(0);

  const [colourList, setColourList] = useState([]);
  const [botColourList, setBotColourList] = useState([]);

  const [mount] = useState(false);

  const [showButtons, setShowButtons] = useState(true);
  const [mode, setMode] = useState(0);
  const [speed, setSpeed] = useState(0);

  const [win, setWin] = useState(false);

  const sentences = [
    "Own a musket for home defense, since that's what the founding fathers intended.",
    "The urgent care center was flooded with patients after the news of a new deadly virus was made public.",
    "Everybody should read Chaucer to improve their everyday vocabulary.",
    "I come from a tribe of head-hunters, so I will never need a shrink.",
    "Gwen had her best sleep ever on her new bed of nails.",
    "He stomped on his fruit loops and thus became a cereal killer.",
    "I am counting my calories, yet I really want dessert.",
    "She says she has the ability to hear the soundtrack of your life.",
    "David proudly graduated from high school top of his class at age 97.",
    "Homesickness became contagious in the young campers' cabin.",
    "Each person who knows you has a different perception of who you are.",
    "My biggest joy is roasting almonds while stalking prey.",
    "After coating myself in vegetable oil, I found my success rate skyrocketed.",
    "He wore the surgical mask in public not to keep from catching a virus, but to keep people away from him.",
    "People generally approve of dogs eating cat food but not cats eating dog food.",
  ];


  // set bot mode
  const clickEasy = () => {
    setMode(1);
    setSpeed(220);
  };

  const clickMed = () => {
    setMode(2);
    setSpeed(120);
  };

  const clickHard = () => {
    setMode(3);
    setSpeed(80);
  };

  useEffect(() => {
    if (mode !== 0) {
      setShowButtons(false);
    } else {
      setShowButtons(true);
    }
  }, [mode]);


  useEffect(() => {
    setIsRunning(0);  // to refresh if person clicks 'back' button and clicks solo again
  }, [mount]);

  const close = () => {
    setReset(true);
  };

  // reset game if reset button is clicked
  useEffect(() => {
    if (reset) {
      setShowText(false);
      document.getElementById('texteh').value = '';
      setTime(0);
      setMode(0);
      setToType('');
      setTyped('');
      setSplitToType(['']);
      setColourList([]);
      setBotColourList([]);
      setIsRunning(0);
    }
  }, [reset]);

  // text generation
  const genText = () => {
    setGetText(true);
    setReset(false);
  }

  const fetchData = async () => {
    let num = Math.floor(Math.random() * (sentences.length));
    setToType(sentences[num]);
  };

  useEffect(() => {
    if (getText) {
      fetchData();
    }
  }, [getText]);

  useEffect(() => {
    if (getText) {
      setGetText(false);
      setShowText(true);
    }
  }, [displayText]);

  // text comparison logic
  useEffect(() => {
    if (getText) {
      let splitted = toType.split(' ');
      setSplitToType(splitted);
      setDisplayText(splitted.slice());
    }
  }, [toType]);


  const handleTextChange = (e) => {
    let value = e.target.value;
    let splitted = value.split(' ');
    let reset = false;
    for (let i = splitted.length - 2; i >= 0; i--) {
      if (splitted[i] === '') {
        splitted.splice(i, 1);
        reset = true;
      }
    }
    if (reset) {
      value = '';
      for (let i = 0, n = splitted.length; i < n; i++) {
        value += splitted[i];
        if (i !== n - 1) {
          value += ' ';
        }
      }
    }

    setTyped(value);
    setSplitTyped(splitted);
    checkWords();

    if (isRunning === 0) {
      resetTimer();
      startTimer();
    }
  };

  useEffect(() => {
    if (hasMounted) {
      checkWords();
    } else {
      setHasMounted(true);
    }
  }, [splitTyped]);

  const checkWords = useCallback(() => {
    let colours = [];
    let wrongs = 0;
    let toDisplay = splitToType.slice();

    for (let i = 0, n = splitTyped.length; i < n; i++) {
      let colour = [];

      for (let j = 0, m = splitTyped[i].length; j < m; j++) {
        let c = '#9a322e';

        if (i < splitToType.length) {
          if (j < splitToType[i].length) {
            if (splitToType[i][j] === splitTyped[i][j]) {
              c = '#26734d';
            }
          } else {
            toDisplay[i] += splitTyped[i].substring(j);
            // for (let k = j, o = splitTyped.length - 1; k < o; k++) {
            //   colour.push('#ffffff');
            // }
            break;
          }
        }

        colour.push(c);
      }

      if (splitToType[i] !== splitTyped[i]) {
        if (i < splitToType.length) {
          wrongs++;
        }
      }
      colours.push(colour);
    }

    setColourList(colours);
    setWrongWords(wrongs);
    setDisplayText(toDisplay);
  }, [splitToType, splitTyped]);

  // colour for text after comparison
  const matchColour = (i, j) => {
    if (i < colourList.length) {
      if (j < colourList[i].length) {
        return { color: colourList[i][j] };
      } else if (i !== colourList.length - 1 && splitToType[i][j] === null) {
        return { color: '#ffffff' };
      }
    }
    return { color: '#2c2c2c' };
  };

  // bot colour matching
  const matchColourBot = (i) => {
    if (i < botColourList.length) {
      return { color: botColourList[i] };
    }
    return { color: '#2c2c2c' };
  };

  // stop game when stopping conditions are met
  useEffect(() => {
    if (isRunning === 1 && splitToType !== null) {
      if (splitTyped.length > splitToType.length || splitToType[splitToType.length - 1] === splitTyped[splitTyped.length - 1]) {
        setWin(true);
        stopTimer();
      }
    }
  }, [splitTyped, splitToType]);

  // timer
  useEffect(() => {
    let interval;
    if (isRunning === 1) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(1);
  };

  const stopTimer = () => {
    setIsRunning(2);
    document.getElementById('texteh').disabled = true;
    document.getElementById('texteh').style.opacity = 0.5;
    document.getElementById('texteh').style.cursor = 'default';
    calculateWPM(time);
  };

  const resetTimer = () => {
    setTime(0);
  };

  const calculateWPM = (elapsed) => {
    setWpm(((splitToType.length - wrongWords + 1) / (elapsed / 1000 / 60)).toFixed(2));
  };

  // handle bot mode
  useEffect(() => {
    if (mode != 0) {
      let interval;
      if (isRunning === 1) {
        let l = botColourList.slice();
        interval = setInterval(() => {
          if (l.length <= toType.length) {
            l.push('#26734d');
            setBotColourList(l);
          }
          if (l.length === toType.length) {
            stopTimer();
          }
        }, speed);
      }
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  return (
    <div className="container">
      {/* bot level buttons */}
      {showButtons ? (
        <div>
          <button
            className="btn btn-dark btn-block"
            onClick={clickEasy}
            style={{ padding: '10px 20px 10px 20px', borderRadius: '15px', marginRight: '10px', fontSize: '25px' }}
          >
            Easy
          </button>

          <button
            className="btn btn-dark btn-block"
            onClick={clickMed}
            style={{ padding: '10px 20px 10px 20px', borderRadius: '15px', marginRight: '10px', fontSize: '25px' }}
          >
            Medium
          </button>

          <button
            className="btn btn-dark btn-block"
            onClick={clickHard}
            style={{ padding: '10px 20px 10px 20px', borderRadius: '15px', marginRight: '10px', fontSize: '25px' }}
          >
            Hard
          </button>

          <div style={{ height: '20px' }}></div>
        </div>
      ) : (
        <div>
          {/* text+typebox / button for text */}
          <div className="row">
            {!showText ? (
              <div style={{ padding: '20px' }}>

                {/* button to generate text: */}
                <button
                  className="btn btn-dark btn-block"
                  onClick={genText}
                  style={{ padding: '10px 20px 10px 20px', borderRadius: '15px', fontSize: '25px' }}
                >
                  Generate Text
                </button>

              </div>
            ) : (
              <div>
                {/* bot text */}
                <p style={{ padding: '15px', backgroundColor: '#ffc53e' }}>
                  🤖:{' '}
                  {toType.slice().split('').map((char, i) => (
                    <span key={i} style={matchColourBot(i)}>
                      {char}
                    </span>
                  ))}
                </p>

                {/* text */}
                <p style={{ padding: '15px' }}>
                  🧔‍♂️:{' '}
                  {displayText.map((word, i) => (
                    <span key={i}>
                      {word.split('').map((char, j) => (
                        <span key={j} style={matchColour(i, j)}>
                          {char}
                        </span>
                      ))}
                      {' '}
                    </span>
                  ))}
                </p>

                {/* <p style={{ padding: '0 0 10px 0' }}>{toType}</p> */}

                {/* textbox */}
                <textarea
                  className="form-control"
                  id='texteh'
                  rows={10}
                  style={{ backgroundColor: "grey", border: "grey", height: '10px', boxShadow: '10px 10px #505050', borderRadius: '12px', opacity: '0.1' }}
                  placeholder=""
                  defaultValue={typed}
                  onInput={handleTextChange}
                />

                {/* time */}
                <h1 style={{ padding: '20px 0 15px 0' }}>
                  time: {(time / 1000).toFixed(2)}s
                </h1>
              </div>
            )}
          </div>

          {/* Stats + Reset Button */}
          {isRunning === 2 ? (
            <div>
              <h1>
                wpm: {wpm}
              </h1>
              <h1 style={{ padding: '15px 0 15px 0' }}>
                wrong words: {wrongWords}

                <div style={{ padding: '15px 0 15px 0' }}>
                  {win ? (
                    <div>
                      You Win!
                    </div>
                  ) : (
                    <div>
                      You Lose :(
                    </div>
                  )}
                </div>

              </h1>
              {/* button to reset: */}
              <button
                className="btn btn-dark btn-block"
                onClick={close}
                style={{ padding: '10px 20px 10px 20px', borderRadius: '15px' }}
              >
                Reset
              </button>

              <div style={{ height: '20px' }}></div>
            </div>
          ) : (
            ''
          )}
        </div>
      )}

    </div>
  );
};

export default Bots;