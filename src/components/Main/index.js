/**@jsx jsx*/
import { useEffect, useState } from 'react'
import { jsx, css } from '@emotion/core'
import * as ml5 from 'ml5'

const modelLoaded = () => {
  console.log('Model Loaded!')
}
const errorStyle = css`
  color: #f00;
`
const wordVectors = ml5.word2vec('../../data/wordvecs10000.json', modelLoaded)

const listWrapperStyle = css`
  padding-left: 0;
`
const listItemStyle = css`
  list-style-type: none;
  padding: 0.2rem 1em;
  background: #eee;
  &:nth-of-type(2n) {
    background: #ccc;
  }
`

const result = array => {
  const lists =
    array.words === null ? (
      <li css={errorStyle}>this word doesn't exist</li>
    ) : (
      Array.from(array.words).map((item, index) => {
        return (
          <li key={index} css={listItemStyle}>
            {item.word} : {item.distance}
          </li>
        )
      })
    )

  return <ul css={listWrapperStyle}>{lists}</ul>
}

const Main = () => {
  const [inputData, setInputData] = useState('rainbow')
  const [data, setData] = useState({ words: [] })
  const nearest = async word => {
    wordVectors
      .nearest(word, (err, results) => {
        return results
      })
      .then(results => {
        return setData({ words: results })
      })
      .catch(err => {
        console.error(err)
      })
  }
  useEffect(() => {
    nearest(inputData)
  }, [])

  const blurHandle = e => {
    setInputData(e.target.value)
    return nearest(e.target.value)
  }

  return (
    <section>
      <h1>search synonym</h1>
      <input
        value={inputData}
        onChange={e => setInputData(e.target.value)}
        onBlur={e => blurHandle(e)}
      />
      {result(data)}
    </section>
  )
}
export default Main
