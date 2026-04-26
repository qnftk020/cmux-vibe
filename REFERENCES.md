# References and Theoretical Background

본 문서는 InjectScan 프로젝트에서 활용된 탐지 기법 및 데이터셋의 학술적/기술적 근거를 정리한 참고 문헌 리스트입니다.

## 1. Prompt Injection & Jailbreaking (핵심 이론)

- **Greshake, K., Abdelnabi, S., Mishra, S., Endres, C., Holz, T., & Fritz, M. (2023).**  
  *"Not What You've Signed Up For: Compromising Real-World LLM Applications via Indirect Prompt Injection."*  
  - **내용**: 웹 페이지에 숨겨진 명령어가 AI 비서에 의해 실행되는 '간접 프롬프트 인젝션'의 위협을 최초로 체계화한 논문입니다. 우리 프로젝트의 시뮬레이션 및 시나리오 설계의 기초가 되었습니다.
  - [arXiv:2302.12173](https://arxiv.org/abs/2302.12173)

- **Zou, A., Wang, Z., Kolter, J. Z., & Matttrick, S. (2023).**  
  *"Universal and Transferable Adversarial Attacks on Aligned Language Models."*  
  - **내용**: AdvBench 데이터셋의 출처이며, 언어 모델의 안전 가드레일을 우회하는 접미사(Suffix) 공격 기법을 다룹니다.
  - [arXiv:2307.15043](https://arxiv.org/abs/2307.15043)

- **Perez, F., & Ribeiro, I. (2022).**  
  *"Ignore Previous Prompt: Attack Techniques For Language Models."*  
  - **내용**: 프롬프트 인젝션의 초기 형태인 지시 무시(Instruction Override) 기법을 분석했습니다.
  - [arXiv:2209.02125](https://arxiv.org/abs/2209.02125)

## 2. Statistical Analysis & PMI (탐지 알고리즘)

- **Church, K. W., & Hanks, P. (1990).**  
  *"Word association norms, mutual information, and lexicography."*  
  - **내용**: Pointwise Mutual Information (PMI) 기법을 자연어 처리에 도입한 고전 논문입니다. 본 프로젝트의 `learn.py` 알고리즘의 통계적 기반이 되었습니다.
  - [Computational Linguistics, 16(1)](https://aclanthology.org/J90-1003/)

- **Bouma, G. (2009).**  
  *"Normalized Pointwise Mutual Information in Natural Language Processing."*  
  - **내용**: PMI의 점수 범위를 정규화하여 가독성을 높인 기법에 대한 설명입니다.
  - [GSCL Proceedings](https://svn.spraakdata.gu.se/repos/gerlof/pub/www/Docs/npmi-p09.pdf)

## 3. LLM-as-Judge & Evaluation (검증 모델)

- **Zheng, L., Chiang, W. L., Sheng, Y., Zhuang, S., Wu, Z., Zhuang, Y., ... & Stoica, I. (2023).**  
  *"Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena."*  
  - **내용**: 강력한 LLM을 활용하여 다른 모델의 출력을 평가하거나 보안 위협을 판단하는 'LLM-as-Judge' 기법의 효용성을 입증했습니다.
  - [arXiv:2306.05685](https://arxiv.org/abs/2306.05685)

## 4. Industry Standards & Datasets (보안 표준 및 데이터)

- **OWASP (2023).**  
  *"OWASP Top 10 for Large Language Model Applications."*  
  - **내용**: LLM 애플리케이션의 10대 보안 취약점 중 LLM01(Prompt Injection)에 대한 정의 및 방어 전략을 제공합니다.
  - [OWASP LLM Project](https://owasp.org/www-project-top-10-for-large-language-model-applications/)

- **JailbreakBench (2024).**  
  *"JailbreakBench: An Open-Source Benchmark for Jailbreaking Large Language Models."*  
  - **내용**: 최신 탈옥(Jailbreak) 프롬프트들의 표준화된 벤치마크 데이터셋입니다.
  - [JailbreakBench Website](https://jailbreakbench.github.io/)

---
**InjectScan Research Team**  
*Compiled by Gemini CLI Research Agent*
