import {h} from 'preact'
import {styled,cxs} from 'preact-styled'


let csxcss1 = cxs({
  backgroundColor: 'yellow',
  border: 'green 5px solid',
  ':hover': {
    backgroundColor: 'black'
  }
})

let csxcss2 = cxs({backgroundColor: 'yellow', border: 'green 5px solid'})


// import {observable} from 'mobx'
// let csxcss = observable.box(csxcss1)
// csxcss.set(csxcss3)

const child = cxs({
  backgroundColor: 'aqua',
  color: 'black',
  '> span': {
    color: 'tomato'
  }
})

let CxsChild = props => <div className={child} {...props}>im black CSX WITH '> SPAN' Selector<span>im tomato</span></div>



let CxsDiv = props => <div className={cxs({backgroundColor: 'yellow', border: 'green 5px solid'})} {...props}>cxs div</div>

let CxsDiv2 = props => <div className={csxcss1} {...props}>cxs div2</div>

let StyledTester = styled('div')({
  backgroundColor: 'orange',
  border: 'teal 5px solid'
})

let StyledTesterProp = styled('div')(props => ({
  backgroundColor: props.bg || 'red'
}))


type BgProp = {
  bg?: 'green' | 'blue'
}

let CsxStyledWithProps = styled<BgProp>('div')(props => ({
  backgroundColor: props.bg || 'red',
  height: '50px',
  ':hover': {
    color: 'black'
  }
}))

let TypedStyledWithProps = styled<BgProp>('div')(props => ({
  backgroundColor: props.bg || 'red',
  height: '50px',
  ':hover': {
    color: 'black'
  }
}))

// $nest: {
//   ':hover': {
//     color: 'black'
//   }}

let WrapperTest = styled(StyledTester)(({
  backgroundColor: 'blue'
}))

let WrapperCxsTest = styled(CxsDiv)(({
  backgroundColor: 'blue'
}))


console.log(cxs.css())

export let StyledPage = (props) =>
<div>
  <CxsDiv/>
  <CxsDiv2/>
  <CxsChild />
  <StyledTester>styled no props</StyledTester>
  <CsxStyledWithProps bg='green' onClick={() => console.log('hi')}>csx =>props</CsxStyledWithProps>
  <CsxStyledWithProps bg='green'>csx with typed props</CsxStyledWithProps>
  <CsxStyledWithProps bg='purple'>csx using wrong typed props</CsxStyledWithProps>
  <StyledTesterProp>styled with props</StyledTesterProp>
  <TypedStyledWithProps>typed => props</TypedStyledWithProps>
  <WrapperTest>bg blue?</WrapperTest>
</div>


export default StyledPage