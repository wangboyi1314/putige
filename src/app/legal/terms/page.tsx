import { LegalDoc } from "@/components/LegalDoc";

export default function TermsPage() {
  return (
    <LegalDoc title="用户协议">
      <p>欢迎使用菩提阁（以下简称「本站」）。在使用本站服务前，请仔细阅读本协议。</p>
      <h2 className="text-amber-300 font-serif text-base pt-2">一、服务说明</h2>
      <p>本站提供周易卜卦、灵签问事、八字排盘、梦境解析等传统文化参考服务。所有结果仅供文化学习与个人参考，不构成任何形式的承诺或保证。</p>
      <h2 className="text-amber-300 font-serif text-base pt-2">二、用户义务</h2>
      <p>您应如实提供相关信息，不得利用本站从事违法违规活动。未满18周岁的用户请勿使用本站服务。</p>
      <h2 className="text-amber-300 font-serif text-base pt-2">三、付费服务</h2>
      <p>部分深度解读为付费内容。付款后即视为确认购买，虚拟服务一经交付不予退款，法律法规另有规定的除外。</p>
      <h2 className="text-amber-300 font-serif text-base pt-2">四、免责声明</h2>
      <p>本站内容不替代医疗、法律、投资等专业意见。您应理性看待解读结果，因依赖本站内容所作决定而产生的后果，由您自行承担。</p>
      <h2 className="text-amber-300 font-serif text-base pt-2">五、协议变更</h2>
      <p>本站有权根据需要修改本协议，修改后的协议公布于本站后即生效。继续使用本站即视为接受修改后的协议。</p>
    </LegalDoc>
  );
}
