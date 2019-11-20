/** @jsx jsx */
import React, {useState, useReducer} from 'react'
import { jsx } from "theme-ui";
import { hsluvToHex, hpluvToHex, hexToHsluv, hexToHpluv } from "hsluv";
import { Formik, Form, Field, ErrorMessage } from 'formik';


function reducer(state, action) {
    switch (action.type) {
      case 'add':
        return [action.payload, ...state]
      default:
        throw new Error();
    }
  }


export default () => {
    const [colors, dispatch] = useReducer(reducer, ["#1fa9f4"]);
    const [h,s,l] =  hexToHsluv(colors[0])
    const [boxColor,setBoxColor] = useState(colors[0])
    return (
  <div>
      <ColorBox color={boxColor}/>
          <Formik
      initialValues={{ h,s,l }}
      validate={values => {
        const errors = {};
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
          console.log(values)
        setTimeout(() => {
           setBoxColor(hsluvToHex([values.h, values.s, values.l]))
           dispatch({type: 'add', payload: hsluvToHex([values.h, values.s, values.l])})

          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field type="range" name="h" min="0" max="360" step="1" />
          <ErrorMessage name="h" component="div" />
           <Field type="range" name="s" min="0" max="100" step="1"/>
          <ErrorMessage name="s" component="div" />
           <Field type="range" name="l" />
          <ErrorMessage name="l" component="div" min="0" max="100" step="1" />
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
    <Formik
      initialValues={{ color: colors[0] }}
      validate={values => {
        const errors = {};
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
            dispatch({type: 'add', payload: values.color})
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field type="text" name="color" />
          <ErrorMessage name="color" component="div" />
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
    {colors.map(color => {
return  <ColorPairings color={color} />
    })}
   
  </div>
);
      }



      const ColorPairings = props => {
       return <div>
           <h1>{props.color}</h1>
           <div sx={{display:'flex'}}>
               {Array(8).fill(undefined).map((v,i) => {
                   const [h,s,l] = hexToHsluv(props.color)
                   const hIsh = h-(i*(360/8))
                   const newH = hIsh < 0 ? 360 + hIsh : hIsh
              return  <ColorBox key={hsluvToHex([newH,s,l])} color={hsluvToHex([newH,s,l])}/>
               })}
           </div>
           </div>
      }

      const ColorBox = ({color})=> <div sx={{width: '5rem', height: '5rem', backgroundColor: color}}/>