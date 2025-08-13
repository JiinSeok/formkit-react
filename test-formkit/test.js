// 패키지가 제대로 import 되는지 테스트
const FormKit = require('@jiin.seok/formkit-react');

console.log('✅ FormKit 패키지 로드 성공!');
console.log('📦 내보낸 항목들:');
console.log('- FormKit:', typeof FormKit.FormKit);
console.log('- useFormContext:', typeof FormKit.useFormContext);
console.log('- SelectKit:', typeof FormKit.SelectKit);
console.log('- Button:', typeof FormKit.Button);
console.log('- cn:', typeof FormKit.cn);

// FormKit 컴포넌트들 확인
if (FormKit.FormKit) {
  console.log('\n🎯 FormKit 컴포넌트들:');
  console.log('- Root:', typeof FormKit.FormKit.Root);
  console.log('- Field:', typeof FormKit.FormKit.Field);
  console.log('- Input:', typeof FormKit.FormKit.Input);
  console.log('- Label:', typeof FormKit.FormKit.Label);
  console.log('- SubmitButton:', typeof FormKit.FormKit.SubmitButton);
  console.log('- Select:', typeof FormKit.FormKit.Select);
}

console.log('\n✨ 패키지가 정상적으로 작동합니다!');