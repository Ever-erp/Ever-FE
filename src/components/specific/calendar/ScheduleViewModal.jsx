import DatePicker from "react-datepicker";
import CustomButton from "../../common/CustomButton";

const ScheduleViewModal = ({ onClose, eventData, onCancel, user }) => {
  const { subjectName, classDesc, classUrl, startDate, endDate, type } =
    eventData;

  return (
    <div className="relative p-8 bg-white rounded-lg shadow-lg w-[500px]">
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
        aria-label="Close modal"
      >
        &times;
      </button>

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl text-brand text-center font-semibold py-2 pb-4">
          수업 일정 보기
        </h2>

        {/* 수업 이름 */}
        <div>
          <label className="text-sm text-gray-600">수업 이름</label>
          <input
            type="text"
            value={subjectName}
            readOnly
            className="w-full border border-gray-300 rounded-md p-2 text-sm bg-gray-100"
          />
        </div>

        {/* 수업 자료 */}
        <div>
          <label className="text-sm text-gray-600">수업 자료</label>
          <input
            type="text"
            value={classUrl}
            readOnly
            onClick={() => {
              const url = classUrl.startsWith("http")
                ? classUrl
                : `https://${classUrl}`;
              window.open(url, "_blank");
            }}
            className="cursor-pointer w-full border border-gray-300 rounded-md p-2 text-sm bg-gray-100"
          />
        </div>

        {/* 일정 */}
        <div className="flex justify-between gap-3">
          <div className="w-1/2">
            <label className="text-sm text-gray-600">시작 날짜</label>
            <DatePicker
              selected={new Date(startDate)}
              readOnly
              disabled
              dateFormat="yyyy-MM-dd"
              className="w-full border border-gray-300 rounded-md p-2 text-sm bg-gray-100"
            />
          </div>
          <div className="w-1/2">
            <label className="text-sm text-gray-600">종료 날짜</label>
            <DatePicker
              selected={new Date(endDate)}
              readOnly
              disabled
              dateFormat="yyyy-MM-dd"
              className="w-full border border-gray-300 rounded-md p-2 text-sm bg-gray-100"
            />
          </div>
        </div>

        {/* 설명 */}
        <div>
          <label className="text-sm text-gray-600">수업 설명</label>
          <textarea
            value={classDesc}
            readOnly
            className="w-full h-24 p-2 rounded-md border border-gray-300 text-sm bg-gray-100 resize-none"
          />
        </div>

        {user?.position === "관리자" && (
          <CustomButton
            label="수업 일정 삭제"
            className="py-[1vh] rounded-lg"
            variant="outline"
            size="md"
            onClick={() => {
              const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
              if (confirmDelete) {
                onCancel();
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ScheduleViewModal;
