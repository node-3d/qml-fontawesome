import QtQuick
import FontAwesome

Rectangle {
	objectName: 'root'
	width: 32
	height: 32

	IconAwesome {
		objectName: 'icon'
		anchors.centerIn: parent
		name: 'fa_play'
	}
}
