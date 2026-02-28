import InputSkeleton from '../Skeletons/InputSkeleton'

export default function SkeletonDataForm() {
  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 flex flex-col gap-4 items-center justify-center">
        <InputSkeleton />
        <InputSkeleton />
        <InputSkeleton />
        <InputSkeleton />
      </div>
  )
}
