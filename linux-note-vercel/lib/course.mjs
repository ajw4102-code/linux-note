import {seed,run,saveFile,HOME} from './engine.mjs';
export const chapters=[
['첫 번째 터미널','현재 위치부터, 한 번에 하나씩','입문'],['파일과 폴더','만들고, 옮기고, 정리하기','입문'],['읽고 찾아보기','파일 속에서 필요한 정보 찾기','기초'],['명령어 연결','출력을 연결하고 파일로 저장하기','기초'],['사용자와 권한','누가 무엇을 할 수 있는지','기초'],['vi와 첫 스크립트','직접 편집하고 실행하기','응용'],['텍스트 처리','많은 기록에서 핵심 추리기','응용'],['프로세스 조사','실행 중인 프로그램 살펴보기','응용'],['네트워크 읽기','주소·포트·연결 이해하기','응용'],['로그 분석','기록으로 상황을 재구성하기','중급'],['셸 자동화','변수·조건·반복으로 일 줄이기','중급'],['보안 종합 실습','단서를 연결하고 점검하기','중급']].map(([title,subtitle,level],i)=>({id:i,title,subtitle,level}));
export const missions=[];
const H=HOME;
export function step(goal,answer,expect,why,concept){return {goal,answer,expect,why,hints:[concept||'목표에 필요한 동작을 명령어 사전에서 찾아보세요. 파일 이름과 현재 위치를 함께 확인하세요.',`사용할 도구: ${typeof answer==='string'?answer.split(' ')[0]:'vi'}. 책 아이콘에서 예시를 볼 수 있어요.`,typeof answer==='string'?answer:`vi ${answer.path}\ni 를 누르고 아래 내용을 입력하세요.\n${answer.content}\nEsc → :wq → Enter` ]}}
function add(ch,title,steps,setup=[]){const m={id:`c${ch}-${missions.filter(m=>m.chapter===ch).length+1}`,chapter:ch,title,steps,setup,minutes:steps.length>3?'15–30':ch<3?'3–5':'5–15'};missions.push(m)}
const S=(goal,answer,expect,why,concept)=>step(goal,answer,expect,why,concept);
const out=t=>['out',t], exists=(p,t='file')=>['exists',p,t], content=(p,t)=>['content',p,t], mode=(p,n)=>['mode',p,n];
const simple=(ch,title,goal,a,e,why,setup=[])=>add(ch,title,[S(goal,a,e,why)],setup);
const a=(...v)=>simple(...v);
// 01 — one action at a time
const pathLessons=[
['여기는 어디일까요?','현재 위치를 화면에 출력하세요.','pwd',out(H),'pwd는 Print Working Directory의 약자예요. 현재 작업 중인 폴더의 전체 경로를 보여줘요.'],
['무엇이 있을까요?','현재 폴더의 파일과 폴더 목록을 확인하세요.','ls',out('welcome.txt'),'ls는 목록을 보여줘요. 경로를 적지 않으면 현재 폴더를 살펴봐요.'],
['폴더 안으로','documents 폴더로 이동하세요.','cd documents',['cwd',H+'/documents'],'cd는 Change Directory예요. 파일이 아닌 폴더로 이동해요.'],
['한 칸 위로','documents에서 상위 폴더로 이동하세요.','cd ..',['cwd',H],'..은 상위 폴더예요. .은 현재 폴더를 뜻해요.',['cd documents']],
['전체 주소로 이동','절대경로로 /var/log 폴더에 들어가세요.','cd /var/log',['cwd','/var/log'],'/로 시작하는 경로는 루트부터 찾는 절대경로예요.'],
['내 방으로 돌아오기','홈 폴더로 돌아가세요.','cd ~',['cwd',H],'~는 현재 사용자의 홈 폴더예요. 여기서는 /home/student예요.',['cd /var/log']],
['숨겨진 이름','홈 폴더의 숨김 파일도 표시하세요.','ls -a',out('.notes'),'이름이 .으로 시작하면 일반 ls에서 숨겨져요. 정상 설정 파일도 많아요.'],
['이전 위치로','바로 전에 있던 /var/log로 돌아가세요.','cd -',['cwd','/var/log'],'cd -는 이전 위치, cd ..은 상위 위치예요. 서로 달라요.',['cd /var/log','cd ~']],
['현재 폴더 표시','현재 폴더를 뜻하는 .을 이용해 목록을 확인하세요.','ls .',out('welcome.txt'),'상대경로는 현재 위치를 기준으로 해석해요.'],
['화면 정리','터미널 화면을 비우세요.','clear',['clear'],'clear는 화면만 정리해요. 파일이나 과제 진행은 지우지 않아요.']];
for(const [title,goal,ans,e,why,setup] of pathLessons)a(0,title,goal,ans,e,why,setup);
// 02
add(1,'첫 작업 폴더',[S('practice 폴더를 만드세요.','mkdir practice',exists(H+'/practice','dir'),'mkdir는 Make Directory예요. 폴더를 만들어요.'),S('practice 폴더로 이동하세요.','cd practice',['cwd',H+'/practice'],'만든 폴더로 이동하면 그 안에서 작업할 수 있어요.')]);
a(1,'빈 파일 만들기','memo.txt라는 빈 파일을 만드세요.','touch memo.txt',exists(H+'/memo.txt'),'touch는 없는 파일을 만들어요. 기존 파일 내용은 지우지 않아요.');
a(1,'파일 복사','welcome.txt를 welcome-copy.txt로 복사하세요.','cp welcome.txt welcome-copy.txt',content(H+'/welcome-copy.txt','Welcome to Linux Note!'),'cp 원본 목적지 순서예요. 원본은 남아 있어요.');
a(1,'이름 바꾸기','welcome.txt의 이름을 hello.txt로 바꾸세요.','mv welcome.txt hello.txt',['renamed',H+'/welcome.txt',H+'/hello.txt'],'mv는 이동과 이름 변경에 사용해요.');
a(1,'폴더로 옮기기','welcome.txt를 documents 안으로 옮기세요.','mv welcome.txt documents',['renamed',H+'/welcome.txt',H+'/documents/welcome.txt'],'목적지가 기존 폴더이면 그 안으로 옮겨요.');
a(1,'파일 지우기','임시 파일 old.txt만 삭제하세요.','rm old.txt',['absent',H+'/old.txt'],'rm은 파일을 삭제해요. 실제 Linux에서는 일반적으로 휴지통으로 가지 않아요.',['touch old.txt']);
a(1,'빈 폴더 지우기','빈 폴더 empty를 삭제하세요.','rmdir empty',['absent',H+'/empty'],'rmdir는 비어 있는 폴더만 삭제해요.',['mkdir empty']);
a(1,'한 번에 깊은 폴더','projects/linux/day1 폴더를 만드세요.','mkdir -p projects/linux/day1',exists(H+'/projects/linux/day1','dir'),'-p는 중간 폴더도 함께 만들어요.');
a(1,'폴더 통째로 복사','documents 폴더를 documents-copy로 복사하세요.','cp -r documents documents-copy',content(H+'/documents-copy/notes.txt','Linux basics'),'-r은 폴더 안의 파일과 하위 폴더까지 복사해요.');
add(1,'작업 공간 정리',[S('workspace 폴더를 만드세요.','mkdir workspace',exists(H+'/workspace','dir'),'먼저 작업할 공간을 준비해요.'),S('welcome.txt를 workspace로 복사하세요.','cp welcome.txt workspace',exists(H+'/workspace/welcome.txt'),'원본을 보존하면서 복사해요.'),S('복사한 파일 이름을 readme.txt로 바꾸세요.','mv workspace/welcome.txt workspace/readme.txt',['renamed',H+'/workspace/welcome.txt',H+'/workspace/readme.txt'],'경로를 적으면 폴더에 들어가지 않아도 작업할 수 있어요.')]);
// 03
const reads=[
['내용 읽기','welcome.txt 내용을 읽으세요.','cat welcome.txt',out('Practice makes progress.'),'cat은 파일 내용을 화면에 출력해요.'],
['첫 두 줄','welcome.txt의 앞 2줄을 확인하세요.','head -n 2 welcome.txt',['exactOut','Welcome to Linux Note!\nLearn one command at a time.\n'],'head는 앞부분을 읽어요. -n 뒤의 숫자는 줄 수예요.'],
['마지막 한 줄','welcome.txt의 마지막 1줄을 확인하세요.','tail -n 1 welcome.txt',['exactOut','Practice makes progress.\n'],'tail은 끝부분을 읽어요. 로그의 최근 내용을 볼 때 유용해요.'],
['줄 번호','notes.txt 내용을 줄 번호와 함께 보세요.','cat -n documents/notes.txt',out('3  Linux security'),'줄 번호로 서로 같은 위치를 가리킬 수 있어요.'],
['단어 찾기','notes.txt에서 Linux가 들어간 줄을 찾으세요.','grep Linux documents/notes.txt',out('Linux security'),'grep은 단어가 포함된 줄을 골라내요. 기본은 대소문자를 구분해요.'],
['대소문자 무시','소문자 linux로 대문자 Linux가 있는 줄도 찾으세요.','grep -i linux documents/notes.txt',out('Linux basics'),'-i는 대소문자 차이를 무시해요.'],
['제외하고 찾기','notes.txt에서 Linux가 없는 줄만 출력하세요.','grep -v Linux documents/notes.txt',['exactOut','Files and folders\n'],'-v는 조건에 맞지 않는 줄을 선택해요.'],
['파일 이름 검색','홈 폴더 아래에서 notes.txt를 찾으세요.','find . -name notes.txt',out(H+'/documents/notes.txt'),'find는 파일의 위치를 찾아요. grep은 파일 내용에서 찾아요.'],
['텍스트 파일만','documents에서 .txt로 끝나는 파일을 찾으세요.','find documents -name "*.txt"',out('documents/secret.txt'),'따옴표 안의 * 패턴을 find가 해석하게 해요.'],
['폴더만 찾기','홈 폴더 아래의 폴더들을 찾으세요.','find . -type d',out(H+'/scripts'),'-type d는 폴더, -type f는 일반 파일을 뜻해요.']];
for(const row of reads)a(2,...row);
// 04
const combos=[
['문장을 파일로','note.txt에 hello를 저장하세요.','echo hello > note.txt',content(H+'/note.txt','hello\n'),' >는 출력을 파일에 저장해요. 같은 파일이 있으면 덮어써요.'],
['이어 쓰기','note.txt 뒤에 second를 한 줄 더 붙이세요.','echo second >> note.txt',['exactContent',H+'/note.txt','first\nsecond\n'],'>>는 기존 내용 뒤에 추가해요.',['echo first > note.txt']],
['줄 수 세기','welcome.txt의 줄 수를 세세요.','wc -l welcome.txt',['exactOut','3\n'],'wc -l은 줄바꿈 개수를 세요.'],
['첫 파이프','notes.txt를 읽어 Linux가 있는 줄만 골라내세요.','cat documents/notes.txt | grep Linux',out('Linux security'),'|는 왼쪽 명령의 출력을 오른쪽 명령의 입력으로 보내요.'],
['실패 횟수','auth.log에서 Failed가 들어간 줄 수를 세세요.','grep Failed /var/log/auth.log | wc -l',['exactOut','4\n'],'필터링한 결과를 wc에 전달해요. 이 로그에서는 한 줄이 한 번의 실패예요.'],
['검색 결과 보관','Failed 기록을 failed.txt에 저장하세요.','grep Failed /var/log/auth.log > failed.txt',content(H+'/failed.txt','Failed password'),'화면에 보이지 않아도 파일에 저장됐을 수 있어요. cat으로 확인해요.'],
['출력 덮어쓰기','note.txt 내용을 새 문장 new로 바꾸세요.','echo new > note.txt',['exactContent',H+'/note.txt','new\n'],'>는 이전 내용을 지워요. >>와 비교하세요.',['echo old > note.txt']],
['단어 수','welcome.txt의 단어 수를 확인하세요.','wc -w welcome.txt',['exactOut','13\n'],'-w는 공백으로 구분된 단어 수를 세요.'],
['출력의 앞부분','auth.log의 실패 기록 중 첫 2개만 출력하세요.','grep Failed /var/log/auth.log | head -n 2',['outLines',2],'파이프를 연결하면 큰 파일에서 필요한 부분만 좁힐 수 있어요.'],
['분석 보고서','report.txt에 제목을 쓰고 실패 횟수를 이어 붙이세요.',null,null,'']];
for(const row of combos.slice(0,9))a(3,...row);
add(3,'분석 보고서',[S('report.txt에 Failed count라는 제목을 쓰세요.','echo "Failed count" > report.txt',content(H+'/report.txt','Failed count'),'공백이 들어간 문장은 따옴표로 묶어요.'),S('실패 로그의 줄 수를 report.txt 뒤에 추가하세요.','grep Failed /var/log/auth.log | wc -l >> report.txt',['exactContent',H+'/report.txt','Failed count\n4\n'],'파이프와 >>를 함께 써서 보고서를 완성해요.')]);
// 05
const permissions=[
['나는 누구?','현재 사용자 이름을 확인하세요.','whoami',['exactOut','student\n'],'실행한 명령의 권한은 현재 사용자와 관련돼요.'],
['사용자 번호','사용자 ID와 그룹을 확인하세요.','id',out('uid=1000(student)'),'UID는 사용자 번호, GID는 그룹 번호예요.'],
['소속 그룹','내가 속한 그룹을 확인하세요.','groups',out('student sudo'),'그룹은 여러 사용자에게 공동 권한을 줄 때 사용해요.'],
['권한 읽기','documents/secret.txt의 상세 권한을 확인하세요.','ls -l documents/secret.txt',out('-rw-------'),'r은 읽기, w는 쓰기, x는 실행. 소유자·그룹·기타 순서로 표시해요.'],
['나만 읽고 쓰기','notes.txt를 소유자만 읽고 쓸 수 있게 바꾸세요.','chmod 600 documents/notes.txt',mode(H+'/documents/notes.txt',600),'6=읽기4+쓰기2, 0=권한 없음이에요.'],
['실행 권한 추가','hello.sh에 소유자 실행 권한을 더하세요.','chmod u+x scripts/hello.sh',mode(H+'/scripts/hello.sh',744),'u는 소유자, +x는 실행 권한 추가예요.'],
['다른 사용자 쓰기 제거','shared.txt에서 기타 사용자 쓰기 권한을 제거하세요.','chmod o-w shared.txt',mode(H+'/shared.txt',664),'o는 기타 사용자예요. 필요 이상으로 쓰기 권한을 주면 파일 변조 위험이 있어요.',['touch shared.txt','chmod 666 shared.txt']],
['계정 목록','/etc/passwd를 읽어 student 계정을 확인하세요.','cat /etc/passwd',out('student:x:1000'),'이 파일은 계정 정보예요. x 자체가 비밀번호는 아니에요.'],
['숫자로 권한 확인','secret.txt의 권한 숫자와 소유자를 확인하세요.','stat documents/secret.txt',out('(600/'),'stat은 파일의 상세 정보를 보여줘요.'],
['개인 작업 폴더','private 폴더를 만들고 소유자만 접근하게 하세요.',null,null,'']];
for(const row of permissions.slice(0,9))a(4,...row);
add(4,'개인 작업 폴더',[S('private 폴더를 만드세요.','mkdir private',exists(H+'/private','dir'),'폴더도 접근 권한이 있어요.'),S('private의 권한을 700으로 바꾸세요.','chmod 700 private',mode(H+'/private',700),'폴더의 x는 내부 경로에 접근할 수 있다는 뜻이에요.')]);
// 06 editor missions use explicit editor actions in solution tests
const edit=(path,content)=>({path,content});
add(5,'vi 열고 나오기',[S('welcome.txt를 vi로 여세요.','vi welcome.txt',['editor',H+'/welcome.txt'],'vi는 편집기예요. 파일을 실행하는 명령어가 아니에요.'),S('변경을 저장하지 않고 나가세요.',':q!',['editorClosed'],'Esc를 누른 다음 :q!와 Enter를 입력하세요. 화면의 :q! 버튼도 같은 동작을 해요.')]);
a(5,'첫 문장 저장','vi로 memo.txt를 만들고 hello를 저장하세요.',edit('memo.txt','hello\n'),content(H+'/memo.txt','hello'),'vi에서 i는 입력 모드, Esc는 일반 모드, :wq는 저장 후 종료예요.');
a(5,'파일 수정','config.txt의 debug=true를 debug=false로 고쳐 저장하세요.',edit('documents/config.txt','debug=false\nport=8080\nmode=development\n'),content(H+'/documents/config.txt','debug=false'),'설정은 파일 내용이에요. 수정 후 결과를 다시 읽어 확인하는 습관이 좋아요.');
a(5,'스크립트 내용 읽기','scripts/hello.sh를 읽으세요.','cat scripts/hello.sh',out('#!/bin/bash'),'#! 뒤의 경로는 이 파일을 해석할 프로그램을 지정해요.');
a(5,'Bash로 실행','Bash로 hello.sh를 실행하세요.','bash scripts/hello.sh',['exactOut','Hello Linux\n'],'bash 파일명은 Bash에게 파일 내용을 읽고 실행하라고 해요.');
add(5,'직접 실행하기',[S('hello.sh에 실행 권한을 주세요.','chmod u+x scripts/hello.sh',mode(H+'/scripts/hello.sh',744),'./로 직접 실행할 때 실행 권한이 필요해요.'),S('scripts로 이동하세요.','cd scripts',['cwd',H+'/scripts'],'현재 폴더를 바꿔요.'),S('hello.sh를 직접 실행하세요.','./hello.sh',['exactOut','Hello Linux\n'],'./는 현재 폴더를 명시해요.')]);
add(5,'나만의 인사',[S('greet.sh에 인사 스크립트를 쓰세요.',edit('greet.sh','#!/bin/bash\necho "Hello student"\n'),content(H+'/greet.sh','echo "Hello student"'),'한 파일 안에 실행할 명령들을 적어요.'),S('greet.sh를 Bash로 실행하세요.','bash greet.sh',['exactOut','Hello student\n'],'화면에 나온 결과와 스크립트 내용을 연결해 보세요.')]);
a(5,'두 명령을 한 파일에','pwd와 ls를 순서대로 실행하는 inspect.sh를 작성하세요.',edit('inspect.sh','#!/bin/bash\npwd\nls\n'),content(H+'/inspect.sh','pwd\nls'),'스크립트는 위에서 아래로 명령을 실행해요.');
a(5,'기존 조사 스크립트','scripts/check.sh를 실행해 실패 기록을 확인하세요.','bash scripts/check.sh',out('Failed password'),'기존 스크립트도 cat으로 내용을 살핀 뒤 실행하는 습관이 좋아요.');
add(5,'편집하고 검증하기',[S('message.txt에 Ready를 저장하세요.',edit('message.txt','Ready\n'),content(H+'/message.txt','Ready'),'저장하면 가상 파일의 내용이 바뀌어요.'),S('터미널에서 저장한 내용을 확인하세요.','cat message.txt',['exactOut','Ready\n'],'편집 화면을 닫은 뒤에도 내용이 남아 있는지 확인해요.')]);
// 07
const textLessons=[
['알파벳 정렬','IP 목록을 정렬하세요.','sort documents/ips.txt',out('192.0.2.10'),'sort는 줄을 정렬해요.'],
['숫자 정렬','numbers.txt를 숫자 크기순으로 정렬하세요.','sort -n documents/numbers.txt',['exactOut','1\n2\n10\n30\n'],'문자 정렬과 숫자 정렬은 달라요. 숫자에는 -n을 써요.'],
['역순 정렬','numbers.txt를 큰 수부터 정렬하세요.','sort -nr documents/numbers.txt',['exactOut','30\n10\n2\n1\n'],'-n은 숫자, -r은 역순이에요.'],
['중복 제거','IP 목록에서 중복을 제거하세요.','sort documents/ips.txt | uniq',['exactOut','192.0.2.10\n192.0.2.20\n192.0.2.30\n'],'uniq는 인접한 중복만 합쳐요. 먼저 정렬하면 같은 값이 모여요.'],
['등장 횟수','각 IP가 몇 번 나오는지 확인하세요.','sort documents/ips.txt | uniq -c',out('3 192.0.2.10'),'-c는 인접한 같은 줄이 몇 개인지 보여줘요.'],
['횟수순 정렬','가장 많이 등장한 IP부터 출력하세요.','sort documents/ips.txt | uniq -c | sort -nr',['exactOut','3 192.0.2.10\n2 192.0.2.20\n1 192.0.2.30\n'],'빈도를 세고 숫자 역순으로 정렬해요.'],
['CSV 첫 열','users.csv의 첫 번째 열만 출력하세요.','cut -d "," -f 1 documents/users.csv',['exactOut','name\nalice\nbob\ncarol\n'],'-d는 구분자, -f는 필드 번호예요.'],
['공백 기준 열','access.log의 첫 열인 IP를 출력하세요.','awk \'{print $1}\' /var/log/access.log',out('192.0.2.10'),'이 실습의 awk는 print $번호 형식의 필드 추출을 지원해요.'],
['화면에서 치환','config.txt의 development를 production으로 바꿔 출력하세요.','sed \'s/development/production/\' documents/config.txt',out('mode=production'),'기본 sed 출력은 원본 파일을 바꾸지 않아요.'],
['파일에도 반영','config.txt의 debug=true를 debug=false로 바꾸어 저장하세요.','sed -i \'s/debug=true/debug=false/\' documents/config.txt',content(H+'/documents/config.txt','debug=false'),'-i는 원본 파일을 수정해요. 먼저 복사본을 만드는 습관이 좋아요.']];
for(const row of textLessons)a(6,...row);
// 08
const processes=[
['실행 중인 프로그램','프로세스 목록을 확인하세요.','ps aux',out('.cache-worker'),'프로세스는 실행 중인 프로그램이에요. PID는 프로세스 번호예요.'],
['프로세스 필터','sshd 프로세스만 찾아보세요.','ps aux | grep sshd',out('210'),'이름으로 목록을 좁힐 수 있어요.'],
['내 프로세스','student 소유 프로세스를 확인하세요.','ps aux | grep student',out('420'),'프로세스에도 소유자가 있어요.'],
['프로세스 상태 보기','top으로 프로세스를 확인하세요.','top',out('1337'),'이 앱의 top은 한 번의 가상 목록을 보여줘요. 실제 top은 계속 갱신되는 화면이에요.'],
['작업 종료','student의 연습 프로세스 PID 1337을 종료하세요.','kill 1337',['noProcess',1337],'기본 kill은 종료 요청 신호를 보내요. 이 시뮬레이터의 프로세스는 즉시 종료돼요.'],
['종료 후 확인','PID 1337을 종료한 뒤 목록에서 없어진 것을 확인하세요.','ps aux',['outNot','1337'],'종료 명령 후 다시 목록을 확인해요.',['kill 1337']],
['백그라운드 실행','sleep 60을 백그라운드 작업으로 시작하세요.','sleep 60 &',['background','sleep 60'],'&를 붙이면 셸 입력을 기다리지 않는 작업으로 시작해요. 여기서는 가상 작업이에요.'],
['내 작업 목록','백그라운드 작업 목록을 확인하세요.','jobs',out('sleep 60'),'jobs는 현재 셸에서 시작한 작업을 살펴봐요.',['sleep 60 &']],
['서비스 확인','SSH 서비스 상태를 확인하세요.','systemctl status ssh',out('Active: active'),'서비스는 백그라운드에서 기능을 제공해요. 여기서는 가상 상태를 조회해요.'],
['정지된 서비스','nginx 서비스의 활성 상태를 확인하세요.','systemctl is-active nginx',['exactOut','inactive\n'],'inactive는 서비스가 실행 중이지 않다는 뜻이에요.']];
for(const row of processes)a(7,...row);
// 09
const networks=[
['호스트 이름','가상 서버의 이름을 확인하세요.','hostname',['exactOut','lab\n'],'호스트 이름은 시스템을 부르는 이름이에요.'],
['IP 주소','가상 서버의 IP 주소를 확인하세요.','ip addr',out('192.0.2.5/24'),'IP는 네트워크상의 주소예요. /24는 네트워크 범위를 나타내요.'],
['기본 경로','기본 게이트웨이를 확인하세요.','ip route',out('default via 192.0.2.1'),'다른 네트워크로 갈 때 기본 경로를 사용해요.'],
['내 컴퓨터 주소','lo 인터페이스의 주소를 찾아보세요.','ip addr | grep 127.0.0.1',out('127.0.0.1'),'127.0.0.1은 루프백 주소예요. 자기 자신을 가리켜요.'],
['연결 확인','lab.local에 가상 ping을 보내세요.','ping lab.local',out('0% packet loss'),'이 앱은 정해진 응답을 보여줘요. 실제 외부 네트워크에 패킷을 보내지 않아요.'],
['열린 포트','수신 대기 중인 TCP·UDP 포트를 숫자로 확인하세요.','ss -tuln',out('0.0.0.0:22'),'-t TCP, -u UDP, -l 수신 대기, -n 숫자 표시에요.'],
['외부 연결','연결된 상대 주소를 확인하세요.','ss -tnp',out('198.51.100.77:4444'),'ESTAB는 연결된 상태예요. 포트 번호 하나만으로 악성 여부를 판단하지 않아요.'],
['프로세스와 연결','어떤 프로세스가 4444 포트와 통신하는지 확인하세요.','lsof -i | grep 4444',out('.cache-worker'),'프로세스 이름·PID·연결 주소를 함께 봐요.'],
['HTTP 응답 헤더','가상 웹 서버의 응답 헤더를 확인하세요.','curl -I http://lab.local',out('HTTP/1.1 200 OK'),'HTTP 응답 헤더는 상태 코드와 서버 정보를 담아요. 이 응답은 교육용 예시예요.'],
['이름과 주소 연결','/etc/hosts를 읽어 lab.local 주소를 확인하세요.','cat /etc/hosts',out('192.0.2.5 lab.local'),'hosts는 호스트 이름과 IP 주소를 연결하는 파일이에요.']];
for(const row of networks)a(8,...row);
// 10
const logs=[
['로그 폴더 방문','/var/log로 이동하세요.','cd /var/log',['cwd','/var/log'],'시스템 로그를 모아 두는 대표적인 경로예요. 배포판·설정마다 로그 위치는 달라요.'],
['로그 파일 목록','/var/log 안의 파일을 확인하세요.','ls /var/log',out('auth.log'),'파일 이름을 먼저 확인하면 경로 오타를 줄일 수 있어요.'],
['인증 기록 읽기','인증 로그 전체를 읽어보세요.','cat /var/log/auth.log',out('Accepted password'),'이 과제에는 성공과 실패한 로그인이 함께 들어 있어요.'],
['실패만 추리기','실패한 로그인 기록만 출력하세요.','grep Failed /var/log/auth.log',['outLines',4],'Failed와 failed는 달라요. 필요하면 -i를 사용해요.'],
['성공만 추리기','성공한 로그인 기록을 찾으세요.','grep Accepted /var/log/auth.log',out('from 192.0.2.20'),'성공했다고 무조건 정상은 아니에요. 사용자·주소·시각을 함께 봐야 해요.'],
['실패 계정','root 계정의 실패 기록을 찾으세요.','grep "for root" /var/log/auth.log',out('192.0.2.30'),'따옴표로 여러 단어를 하나의 검색 문자열로 전달해요.'],
['실패 IP 추출','실패 기록에서 IP 주소인 11번째 필드를 추출하세요.','grep Failed /var/log/auth.log | awk \'{print $11}\'',out('192.0.2.10'),'이 예시 형식에서만 11번째 필드가 IP예요. 실제 로그 형식이 바뀌면 다시 확인해야 해요.'],
['가장 잦은 실패','실패 IP별 횟수를 많은 순서대로 출력하세요.','grep Failed /var/log/auth.log | awk \'{print $11}\' | sort | uniq -c | sort -nr',['exactOut','3 192.0.2.10\n1 192.0.2.30\n'],'검색 → 필드 추출 → 정렬 → 집계 → 순위 순서예요.'],
['거부된 웹 요청','access.log에서 HTTP 403 응답을 찾으세요.','grep 403 /var/log/access.log',out('/admin 403'),'403은 접근 거부예요. 한 건만으로 침입을 단정할 수는 없어요.'],
['웹 요청 횟수','IP별 웹 요청 횟수를 집계하세요.','awk \'{print $1}\' /var/log/access.log | sort | uniq -c',out('2 192.0.2.10'),'같은 분석 방법을 다른 로그에도 적용할 수 있어요.']];
for(const row of logs)a(9,...row);
// 11
const scripts=[
['변수 만들기','NAME 변수에 student를 넣으세요.','NAME=student',['var','NAME','student'],'변수는 값에 붙인 이름이에요. = 앞뒤에는 공백을 넣지 않아요.'],
['변수 읽기','NAME 변수의 값을 출력하세요.','echo "$NAME"',['exactOut','student\n'],'$NAME으로 변수 값을 읽어요. 큰따옴표는 공백을 포함한 값을 보호해요.',['NAME=student']],
['환경 변수','COURSE=linux를 환경 변수로 등록하세요.','export COURSE=linux',['var','COURSE','linux'],'export는 자식 프로세스에 전달할 환경 변수를 지정해요. 여기서는 학습용 변수 공간에 저장해요.'],
['환경 확인','HOME 환경 변수를 목록에서 확인하세요.','env | grep HOME',out('HOME=/home/student'),'환경 변수에는 홈 경로 같은 실행 환경 정보가 있어요.'],
['변수가 있는 스크립트','name.sh를 작성하세요. NAME=student 다음 줄에서 echo "$NAME"을 실행해야 해요.',edit('name.sh','#!/bin/bash\nNAME=student\necho "$NAME"\n'),content(H+'/name.sh','echo "$NAME"'),'변수 대입과 사용을 파일 안에 묶어요.'],
['스크립트 변수 출력','name.sh를 실행하세요.','bash name.sh',['exactOut','student\n'],'스크립트의 출력이 기대와 같은지 확인해요.'],
['반복문 작성','a b c를 한 줄씩 출력하는 loop.sh를 작성하세요.',edit('loop.sh','#!/bin/bash\nfor item in a b c; do\necho "$item"\ndone\n'),content(H+'/loop.sh','for item in a b c; do'),'for는 준비한 값들을 순서대로 변수에 넣어 반복해요.'],
['반복문 실행','loop.sh를 실행하세요.','bash loop.sh',['exactOut','a\nb\nc\n'],'같은 명령을 여러 대상에 반복할 수 있어요.'],
['조건문 작성','welcome.txt가 있으면 found를 출력하는 test.sh를 작성하세요.',edit('test.sh','#!/bin/bash\nif [ -f welcome.txt ]; then\necho found\nelse\necho missing\nfi\n'),content(H+'/test.sh','if [ -f welcome.txt ]; then'),'[ -f 경로 ]는 일반 파일인지 검사해요. then과 fi로 실행 범위를 정해요.'],
['조건문 실행','test.sh를 실행해 파일 존재 여부를 확인하세요.','bash test.sh',['exactOut','found\n'],'조건에 맞으면 then, 맞지 않으면 else 부분을 실행해요.']];
for(let i=0;i<scripts.length;i++){const setup=i===5?[edit('name.sh','#!/bin/bash\nNAME=student\necho "$NAME"\n')]:i===7?[edit('loop.sh','#!/bin/bash\nfor item in a b c; do\necho "$item"\ndone\n')]:i===9?[edit('test.sh','#!/bin/bash\nif [ -f welcome.txt ]; then\necho found\nelse\necho missing\nfi\n')]:scripts[i][6]||[];a(10,...scripts[i].slice(0,6),setup)}
// 12 — linked investigation steps, 10 different goals
add(11,'숨겨진 작업 파일',[S('/tmp의 숨김 파일까지 확인하세요.','ls -la /tmp',out('.cache-worker'),'숨김 이름 자체는 악성의 증거가 아니에요.'),S('/tmp/.cache-worker 내용을 읽으세요.','cat /tmp/.cache-worker',out('training worker'),'파일의 내용과 역할을 함께 확인해요.')]);
add(11,'특수 권한 점검',[S('/opt에서 SUID 비트가 설정된 파일을 찾으세요.','find /opt -perm -4000',out('/opt/review-tool'),'SUID는 실행 시 파일 소유자의 권한과 관련된 특수 비트예요.'),S('발견한 파일의 소유자와 권한을 확인하세요.','ls -l /opt/review-tool',out('-rwsr-xr-x'),'정상 프로그램에도 SUID가 있어요. 출처와 필요성을 확인해야 해요.')]);
add(11,'허용된 관리자 명령',[S('sudo로 허용된 명령 목록을 확인하세요.','sudo -l',out('/usr/bin/systemctl status *'),'sudo -l은 현재 사용자가 허용받은 명령을 보여줘요.'),S('허용된 명령으로 SSH 서비스 상태를 확인하세요.','sudo systemctl status ssh',out('Active: active'),'필요한 범위의 권한만 사용하는 원칙을 익혀요.')]);
add(11,'예약 작업 조사',[S('현재 계정의 예약 작업을 확인하세요.','crontab -l',out('/tmp/.cache-worker'),'cron은 정해진 시간에 명령을 실행해요.'),S('시스템 예약 작업도 확인하세요.','cat /etc/crontab',out('0 2 * * * root'),'시스템 crontab에는 사용자 칸도 있어요. 개인 crontab과 형식이 달라요.'),S('보고서에 조사 대상 경로를 기록하세요.','echo /tmp/.cache-worker > cron-report.txt',content(H+'/cron-report.txt','/tmp/.cache-worker'),'경로와 실행 주기를 기록하고 정상 작업인지 확인해요.')]);
add(11,'연결과 프로세스 대조',[S('가상 서버의 연결된 소켓을 확인하세요.','ss -tnp',out('198.51.100.77:4444'),'원격 주소와 포트를 확인해요.'),S('연결에 관련된 프로세스를 찾으세요.','lsof -i | grep 4444',out('1337'),'연결을 소유한 PID를 확인해요.'),S('PID 1337의 실행 명령을 확인하세요.','ps aux | grep 1337',out('/tmp/.cache-worker'),'연결·PID·파일 경로를 연결해서 이해해요.')]);
add(11,'공유 파일 보호',[S('노출된 파일의 상세 권한을 확인하세요.','ls -l exposed.txt',out('-rw-rw-rw-'),'모든 사용자가 쓸 수 있는 파일인지 확인해요.'),S('소유자만 읽고 쓰도록 수정하세요.','chmod 600 exposed.txt',mode(H+'/exposed.txt',600),'실제 작업에서는 파일 사용 목적과 필요한 접근 권한을 먼저 확인해요.'),S('변경된 권한을 확인하세요.','stat exposed.txt',out('(600/'),'변경 후 검증까지 해야 작업이 끝나요.')],['echo training > exposed.txt','chmod 666 exposed.txt']);
add(11,'로그 보존과 분석',[S('인증 로그를 홈의 auth-copy.log로 복사하세요.','cp /var/log/auth.log auth-copy.log',content(H+'/auth-copy.log','Accepted password'),'분석용 복사본으로 원본을 보존하는 습관을 익혀요.'),S('복사본에서 실패 기록을 evidence.txt로 저장하세요.','grep Failed auth-copy.log > evidence.txt',content(H+'/evidence.txt','Failed password'),'관련 기록만 별도 파일로 정리해요.'),S('추린 기록이 몇 줄인지 확인하세요.','wc -l evidence.txt',['exactOut','4\n'],'결과의 범위와 건수를 확인해요.')]);
add(11,'실패 로그인 요약',[S('실패 IP별 횟수를 summary.txt에 저장하세요.','grep Failed /var/log/auth.log | awk \'{print $11}\' | sort | uniq -c | sort -nr > summary.txt',content(H+'/summary.txt','3 192.0.2.10'),'단계별 변환을 하나의 파이프로 연결해요.'),S('가장 많이 실패한 IP 한 줄만 확인하세요.','head -n 1 summary.txt',['exactOut','3 192.0.2.10\n'],'이 로그에서의 빈도예요. 공격 여부는 추가 정보가 필요해요.')]);
add(11,'설정 변경 기록',[S('config.txt를 backup/config.txt로 복사하세요.','cp documents/config.txt backup/config.txt',content(H+'/backup/config.txt','debug=true'),'변경 전에 복구할 복사본을 만들어요.'),S('원본 config.txt에서 debug를 false로 바꾸세요.','sed -i \'s/debug=true/debug=false/\' documents/config.txt',content(H+'/documents/config.txt','debug=false'),'변경할 항목을 정확히 지정해요.'),S('원본 변경 내용을 검색해서 확인하세요.','grep debug documents/config.txt',['exactOut','debug=false\n'],'바꾸려던 설정이 반영됐는지 확인해요.')]);
add(11,'종합 조사 보고서',[S('incident 폴더를 만드세요.','mkdir incident',exists(H+'/incident','dir'),'조사 결과를 모을 공간을 만들어요.'),S('실패 로그인 기록을 incident/auth.txt에 저장하세요.','grep Failed /var/log/auth.log > incident/auth.txt',content(H+'/incident/auth.txt','Failed password'),'인증 기록을 확인해요.'),S('연결 정보를 incident/network.txt에 저장하세요.','ss -tnp > incident/network.txt',content(H+'/incident/network.txt','198.51.100.77'),'연결 정보는 이 실습 시점의 가상 상태예요.'),S('프로세스 목록을 incident/processes.txt에 저장하세요.','ps aux > incident/processes.txt',content(H+'/incident/processes.txt','1337'),'프로세스와 연결을 대조할 수 있어요.'),S('예약 작업을 incident/cron.txt에 저장하세요.','crontab -l > incident/cron.txt',content(H+'/incident/cron.txt','.cache-worker'),'여러 단서를 한곳에 모아 판단의 근거를 남겨요.'),S('incident 폴더를 소유자만 접근하도록 보호하세요.','chmod 700 incident',mode(H+'/incident',700),'조사 자료에도 적절한 접근 권한이 필요해요.')]);
const firstPass=missions.slice();
missions.length=0;
const reviewLevels=[
  {label:'기본 복습',prefix:'배운 명령어를 기억해서 새로운 상황에 적용하세요.'},
  {label:'응용 복습',prefix:'두 개 이상의 단서를 연결하는 상황이라고 생각하고 해결하세요.'},
  {label:'심화 복습',prefix:'정보보안 점검 상황에서 결과를 확인하고 다음 판단까지 이어가세요.'}
];
for(let chapter=0;chapter<chapters.length;chapter++){
  const originals=firstPass.filter(m=>m.chapter===chapter);
  missions.push(...originals);
  for(let level=0;level<reviewLevels.length;level++){
    const source=originals[[0,Math.floor(originals.length/2),originals.length-1][level]]||originals[0];
    const review=JSON.parse(JSON.stringify(source));
    review.id=`c${chapter}-r${level+1}`;
    review.title=`${reviewLevels[level].label} · ${chapters[chapter].title}`;
    review.review=true;
    review.reviewLevel=level+1;
    review.steps=review.steps.map((item)=>({...item,
      goal:`${reviewLevels[level].prefix} ${item.goal}`,
      why:`${reviewLevels[level].label}에서는 같은 원리를 다른 맥락에서 다시 사용합니다. ${item.why}`,
      hints:[
        level===0?'앞에서 배운 명령어와 대상 경로를 먼저 떠올려 보세요.':'정답을 바로 보지 말고 어떤 정보를 먼저 확인해야 하는지 생각해 보세요.',
        item.hints?.[1]||'책 아이콘에서 명령어의 역할과 옵션을 확인해 보세요.',
        item.hints?.[2]||item.answer
      ]
    }));
    missions.push(review);
  }
}
export function initialFor(m){let s=seed();for(const action of m?.setup||[])s=typeof action==='string'?run(s,action):saveFile(s,action.path.startsWith('/')?action.path:HOME+'/'+action.path,action.content);s.history=[];s.last={out:'',code:0};return s}
export function passed(s,step,command='',editorClosed=false){if(s.last.code!==0)return false;const [kind,p,v]=step.expect;const n=s.fs[p];switch(kind){case 'cwd':return s.cwd===p;case 'exists':return n?.type===v;case 'absent':return !n;case 'renamed':return !n&&!!s.fs[v];case 'mode':return n?.mode===v;case 'content':return n?.content.includes(v);case 'exactContent':return n?.content===v;case 'out':case 'exactOut':case 'outLines':case 'outNot':{if(/^\s*(echo|printf)\b/.test(command)&&!(typeof step.answer==='string'&&/^(echo|printf)/.test(step.answer)))return false;const o=s.last.out||'';return kind==='out'?o.includes(p):kind==='exactOut'?o===p:kind==='outNot'?o.length>0&&!o.includes(p):o.trim().split('\n').length===p&&o.length>0}case 'var':return s.vars[p]===v;case 'clear':return !!s.last.clear;case 'editor':return s.last.editor?.path===p;case 'editorClosed':return editorClosed;case 'noProcess':return !s.processes.some(x=>x.pid===p);case 'background':return s.processes.some(x=>x.background&&x.cmd.trim()===p);default:return false}}
