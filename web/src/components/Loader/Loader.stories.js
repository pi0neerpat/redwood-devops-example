import Loader from './Loader'

export const generated = () => {
  return (
    <div className="flex items-center justify-center">
      <div>
        <Loader />
        <p>Example text below the loader</p>
      </div>
    </div>
  )
}

export default { title: 'Components/Loader' }
