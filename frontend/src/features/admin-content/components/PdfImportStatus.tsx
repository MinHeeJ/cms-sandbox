export function PdfImportStatus() {
  return (
    <div className="rounded-lg border border-ld bg-white p-6">
      <strong className="text-base font-semibold text-dark">PDF 변환 범위</strong>
      <p className="mt-2 text-sm font-medium text-bodytext">텍스트, 이미지, 링크 추출 가능 여부를 표시하고 암호화·손상 PDF는 차단 사유를 안내합니다.</p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <span className="rounded-md bg-lightsuccess px-4 py-3 text-sm font-semibold text-[#079982]">텍스트 추출 가능</span>
        <span className="rounded-md bg-lightprimary px-4 py-3 text-sm font-semibold text-primary">이미지 별도 검토</span>
        <span className="rounded-md bg-lighterror px-4 py-3 text-sm font-semibold text-error">암호화 PDF 차단</span>
      </div>
    </div>
  );
}
